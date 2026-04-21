import type { Env,ChatMessage,TelegramUpdate } from './types';
import { sendTelegramMessage,sendTelegramAction,sanitizeText,sanitizeName,isRateLimited } from './telegram';

const clients = new Map<string, WebSocket>();
const rateLimitMap = new Map<string,{ count: number; resetTime: number }>();
const lastTypingUpdate = new Map<string, number>();

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (path === '/api/send' && request.method === 'POST') {
      return handleSendMessage(request, env, clientIp);
    }

    if (path === '/api/stream') {
      return handleWebSocket(request, env);
    }

    if (path === '/api/typing') {
      return handleTypingStatus(request, env);
    }

    if (path === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    if (path === '/api/messages') {
      return handleGetMessages(request, env);
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', clients: clients.size }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleSendMessage(request: Request, env: Env, clientIp: string): Promise<Response> {
  if (isRateLimited(clientIp, rateLimitMap, 10, 60000)) {
    return new Response(JSON.stringify({ error: 'Rate limited. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json() as { name: string; text: string };
    const name = sanitizeName(body.name || 'Anonymous');
    const text = sanitizeText(body.text, 500);

    if (!text) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const adminChatId = env.ADMIN_CHAT_ID;
    if (!adminChatId) {
      console.log('New visitor message:', { name, text });
      return new Response(JSON.stringify({ error: 'Bot not configured yet' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messageText = `<b>${name}</b>:\n${text}`;
    const success = await sendTelegramMessage(env, adminChatId, messageText);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    for (const [, socket] of clients) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'message',
          from: 'visitor',
          name,
          text,
          timestamp: Date.now(),
        }));
      }
    }

    return new Response(JSON.stringify({ success: true, name }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling send message:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleWebSocket(request: Request, env: Env): Promise<Response> {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const clientId = crypto.randomUUID();
  const { 0: client, 1: server } = new WebSocketPair();

  server.accept();
  server.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data as string);
      if (data.type === 'admin_typing') {
        for (const [id, socket] of clients) {
          if (id !== clientId && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'typing', value: data.value }));
          }
        }
      }
      if (data.type === 'admin_message') {
        for (const [, socket] of clients) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'message',
              from: 'admin',
              name: 'You',
              text: data.text,
              timestamp: Date.now(),
            }));
          }
        }
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });

  server.addEventListener('close', () => {
    clients.delete(clientId);
  });

  clients.set(clientId, server);

  return new Response(null, { status: 101, webSocket: server });
}

async function handleTypingStatus(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const lastUpdate = url.searchParams.get('last');

  const adminChatId = env.ADMIN_CHAT_ID;
  if (!adminChatId) {
    return new Response(JSON.stringify({ typing: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastTypingTime = lastTypingUpdate.get(adminChatId) || 0;
  const isTyping = lastUpdate && parseInt(lastUpdate) >= lastTypingTime - 3000;

  return new Response(JSON.stringify({ typing: isTyping }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const update = await request.json() as TelegramUpdate;

    if (update.message && update.message.chat) {
      const chatId = update.message.chat.id.toString();
      const text = update.message.text || '';
      const messageId = update.message.message_id;

      if (chatId === env.ADMIN_CHAT_ID) {
        lastTypingUpdate.set(chatId, Date.now());

        for (const [, socket] of clients) {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'message',
              from: 'admin',
              name: 'You',
              text: sanitizeText(text, 500),
              timestamp: Date.now(),
              messageId,
            }));
          }
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetMessages(request: Request, env: Env): Promise<Response> {
  return new Response(JSON.stringify({ messages: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}