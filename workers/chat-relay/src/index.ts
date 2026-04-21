import type { Env,ChatMessage,TelegramUpdate } from './types';
import { sendTelegramMessage,sendTelegramAction,sanitizeText,sanitizeName,isRateLimited } from './telegram';

const clients = new Map<string, WebSocket>();
const rateLimitMap = new Map<string,{ count: number; resetTime: number }>();
const lastTypingUpdate = new Map<string, number>();
const adminMessages: Array<{id: string, text: string, timestamp: number, delivered: boolean}> = [];
const visitorInfo: Map<string, {username?: string, phone?: string, name: string}> = new Map();

const ALLOWED_ORIGINS = ['https://riz.kim', 'https://fahma.pages.dev', 'http://localhost:4321'];

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    const origin = request.headers.get('Origin') || '';

    if (path === '/api/send' && request.method === 'POST') {
      return handleSendMessage(request, env, clientIp);
    }

    if (path === '/api/send' && request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
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

    if (path === '/api/poll') {
      return handlePollMessages(request, env);
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', clients: clients.size }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    if (path === '/api/debug') {
      return new Response(JSON.stringify({ 
        adminMessages: adminMessages,
        clientCount: clients.size 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleSendMessage(request: Request, env: Env, clientIp: string): Promise<Response> {
  const origin = request.headers.get('Origin') || '';
  const cors = corsHeaders(origin);

  if (isRateLimited(clientIp, rateLimitMap, 10, 60000)) {
    return new Response(JSON.stringify({ error: 'Rate limited. Try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  try {
    const body = await request.json() as { name: string; text: string; phone?: string; telegram?: string };
    const name = sanitizeName(body.name || 'Anonymous');
    const text = sanitizeText(body.text, 500);
    const phone = body.phone || '';
    const telegram = body.telegram || '';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const adminChatId = env.ADMIN_CHAT_ID;
    if (!adminChatId) {
      console.log('New visitor message:', { name, phone, telegram, text });
      return new Response(JSON.stringify({ error: 'Bot not configured yet' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const visitorId = `web_${Date.now()}`;
    visitorInfo.set(visitorId, { name, phone, telegram });
    
    const contactParts = [];
    if (phone) contactParts.push(`📱 ${phone}`);
    if (telegram) contactParts.push(`📨 @${telegram.replace('@', '')}`);
    const contactInfo = contactParts.length > 0 ? `\n${contactParts.join(' | ')}` : '';
    
    const messageText = `<b>👤 ${name}</b>${contactInfo}\n📝 ${text}\n\n<em>💬 Just reply with any message to send to the visitor!</em>`;
    const success = await sendTelegramMessage(env, adminChatId, messageText);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
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
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (error) {
    console.error('Error handling send message:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...cors },
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

    if (!update.message || !update.message.chat) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const chatId = update.message.chat.id.toString();
    const text = update.message.text || '';
    const messageId = update.message.message_id;
    const from = update.message.from;

    if (chatId === env.ADMIN_CHAT_ID) {
      console.log('Admin message received:', { text, messageId });
      
      if (text.startsWith('/start')) {
        return new Response(JSON.stringify({ ok: true, message: 'Just send any message to reply!' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const replyMsg = {
        id: `reply_${Date.now()}`,
        text: sanitizeText(text, 500),
        timestamp: Date.now(),
        delivered: false
      };
      adminMessages.push(replyMsg);
      
      for (const [, socket] of clients) {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'message',
            from: 'admin',
            name: 'You',
            text: replyMsg.text,
            timestamp: replyMsg.timestamp,
          }));
        }
      }
      return new Response(JSON.stringify({ ok: true, reply_sent: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const username = from?.username;
    const phone = from?.phone_number;
    const visitorName = from?.first_name || 'Visitor';
    
    console.log('New visitor:', { chatId, username, phone, name: visitorName });

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
  return new Response(JSON.stringify({ messages: adminMessages.filter(m => !m.delivered) }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handlePollMessages(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const since = parseInt(url.searchParams.get('since') || '0');
  const origin = request.headers.get('Origin') || '';
  
  const newMessages = adminMessages.filter(m => m.timestamp > since && !m.delivered);
  
  const messagesToReturn = newMessages.map(m => ({
    id: m.id,
    text: m.text,
    timestamp: m.timestamp,
    from: 'admin',
    name: 'You'
  }));
  
  setTimeout(() => {
    for (const msg of newMessages) {
      msg.delivered = true;
    }
  }, 1000);
  
  return new Response(JSON.stringify({ 
    messages: messagesToReturn
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}