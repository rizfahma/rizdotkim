import type { Env, ChatMessage, TelegramUpdate, Conversation, StoredMessage, Presence } from './types';
import { sendTelegramMessage, sendTelegramAction, sanitizeText, sanitizeName, isRateLimited } from './telegram';

const clients = new Map<string, { socket: WebSocket; conversationId?: string }>();
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const lastTypingUpdate = new Map<string, number>();

const ALLOWED_ORIGINS = ['https://riz.kim', 'https://fahma.pages.dev', 'http://localhost:4321'];
const PRESENCE_TIMEOUT_MS = 10 * 60 * 1000;

function corsHeaders(origin: string): Record<string, string> {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
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

    if (path === '/api/presence') {
      return handlePresence(request, env);
    }

    if (path === '/api/conversation') {
      return handleConversation(request, env);
    }

    if (path === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', clients: clients.size }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    if (path === '/api/debug') {
      return new Response(JSON.stringify({
        clientCount: clients.size,
        rateLimitCount: rateLimitMap.size
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
    const body = await request.json() as { name: string; text: string; phone?: string; telegram?: string; conversation_id?: string };
    const name = sanitizeName(body.name || 'Anonymous');
    const text = sanitizeText(body.text, 500);
    const phone = body.phone || '';
    const telegram = body.telegram || '';
    let conversationId = body.conversation_id;

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

    const now = Date.now();
    let conversation: Conversation | null = null;

    if (conversationId) {
      const existingConv = await env.CHAT_KV.get(`conversation:${conversationId}`);
      if (existingConv) {
        conversation = JSON.parse(existingConv);
      }
    }

    if (!conversation) {
      conversationId = generateConversationId();
      conversation = {
        id: conversationId,
        session_id: `session_${now}`,
        status: 'active',
        created_at: now,
        updated_at: now,
        last_seen_at: now,
        visitor_name: name,
        visitor_phone: phone || undefined,
        visitor_telegram: telegram || undefined,
      };
      await env.CHAT_KV.put(`conversation:${conversationId}`, JSON.stringify(conversation));
    } else {
      conversation.updated_at = now;
      conversation.last_seen_at = now;
      if (phone) conversation.visitor_phone = phone;
      if (telegram) conversation.visitor_telegram = telegram;
      conversation.visitor_name = name;
      await env.CHAT_KV.put(`conversation:${conversationId}`, JSON.stringify(conversation));
    }

    const contactParts = [];
    if (phone) contactParts.push(`📱 ${phone}`);
    if (telegram) contactParts.push(`📨 @${telegram.replace('@', '')}`);
    const contactInfo = contactParts.length > 0 ? `\n${contactParts.join(' | ')}` : '';
    
    const messageText = `<b>👤 ${name}</b>${contactInfo}\n📝 ${text}\n\n<em>💬 Just reply to this message to respond!</em>`;
    const telegramResult = await sendTelegramMessage(env, adminChatId, messageText);

    if (!telegramResult.ok) {
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const visitorMessage: StoredMessage = {
      id: `msg_${now}`,
      conversation_id: conversationId,
      sender_type: 'visitor',
      text,
      telegram_message_id: telegramResult.message_id,
      created_at: now,
      delivered: true,
    };
    await env.CHAT_KV.put(`message:${visitorMessage.id}`, JSON.stringify(visitorMessage));
    await env.CHAT_KV.put(`conv_messages:${conversationId}`, JSON.stringify([visitorMessage]));

    if (telegramResult.message_id) {
      await env.CHAT_KV.put(`tg_msg:${telegramResult.message_id}`, JSON.stringify({ conversationId }));
    }

    for (const [clientId, client] of clients) {
      if (client.conversationId === conversationId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify({
          type: 'message',
          from: 'visitor',
          name,
          text,
          timestamp: now,
        }));
      }
    }

    await updatePresence(env, 'auto');

    return new Response(JSON.stringify({ success: true, conversation_id: conversationId, name }), {
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

async function updatePresence(env: Env, source: 'manual' | 'auto' = 'auto'): Promise<void> {
  const presence: Presence = {
    state: 'online',
    updated_at: Date.now(),
    source,
  };
  await env.CHAT_KV.put('presence', JSON.stringify(presence));
}

async function getPresence(env: Env): Promise<Presence> {
  const presenceStr = await env.CHAT_KV.get('presence');
  if (presenceStr) {
    const presence = JSON.parse(presenceStr) as Presence;
    const now = Date.now();
    
    if (presence.source === 'manual') {
      return presence;
    }
    
    if (presence.source === 'auto' && now - presence.updated_at > PRESENCE_TIMEOUT_MS) {
      return { state: 'offline', updated_at: presence.updated_at, source: 'auto' };
    }
    
    return presence;
  }
  
  return { state: 'offline', updated_at: Date.now(), source: 'auto' };
}

async function handleWebSocket(request: Request, env: Env): Promise<Response> {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversation_id');

  const clientId = crypto.randomUUID();
  const { 0: client, 1: server } = new WebSocketPair();

  server.accept();
  server.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data as string);
      if (data.type === 'admin_typing') {
        for (const [id, clientData] of clients) {
          if (id !== clientId && clientData.socket.readyState === WebSocket.OPEN) {
            clientData.socket.send(JSON.stringify({ type: 'typing', value: data.value }));
          }
        }
      }
      if (data.type === 'admin_message') {
        for (const [, clientData] of clients) {
          if (clientData.conversationId === conversationId && clientData.socket.readyState === WebSocket.OPEN) {
            clientData.socket.send(JSON.stringify({
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

  clients.set(clientId, { socket: server, conversationId: conversationId || undefined });

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
    const replyToMessageId = update.message.reply_to_message_id;
    const from = update.message.from;

    const adminChatId = String(env.ADMIN_CHAT_ID);
    const isAdmin = String(chatId) === adminChatId;
    
    if (isAdmin) {
      if (text.startsWith('/start')) {
        return new Response(JSON.stringify({ ok: true, message: 'Use /online, /offline, /away to change status. Reply to visitor messages to respond!' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (text.startsWith('/online') || text.startsWith('/offline') || text.startsWith('/away')) {
        const command = text.split(' ')[0].toLowerCase();
        let state: 'online' | 'offline' | 'away' = 'online';
        if (command === '/offline') state = 'offline';
        else if (command === '/away') state = 'away';
        
        const presence: Presence = {
          state,
          updated_at: Date.now(),
          source: 'manual',
        };
        await env.CHAT_KV.put('presence', JSON.stringify(presence));
        return new Response(JSON.stringify({ ok: true, presence: state }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!replyToMessageId) {
        return new Response(JSON.stringify({ ok: true, error: 'Please reply to the visitor message' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const telegramMessageIdStr = await env.CHAT_KV.get(`tg_msg:${replyToMessageId}`);
      if (!telegramMessageIdStr) {
        return new Response(JSON.stringify({ ok: true, error: 'Could not find conversation. Reply to the visitor message.' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { conversationId } = JSON.parse(telegramMessageIdStr);
      const conversationStr = await env.CHAT_KV.get(`conversation:${conversationId}`);
      if (!conversationStr) {
        return new Response(JSON.stringify({ ok: true, error: 'Conversation not found' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const conversation = JSON.parse(conversationStr) as Conversation;
      const sanitizedText = sanitizeText(text, 500);
      const now = Date.now();

      const adminMessage: StoredMessage = {
        id: `msg_admin_${now}`,
        conversation_id: conversationId,
        sender_type: 'admin',
        text: sanitizedText,
        telegram_message_id: messageId,
        created_at: now,
        delivered: true,
      };
      await env.CHAT_KV.put(`message:${adminMessage.id}`, JSON.stringify(adminMessage));

      const existingMessagesStr = await env.CHAT_KV.get(`conv_messages:${conversationId}`);
      let existingMessages: StoredMessage[] = [];
      if (existingMessagesStr) {
        existingMessages = JSON.parse(existingMessagesStr);
      }
      existingMessages.push(adminMessage);
      await env.CHAT_KV.put(`conv_messages:${conversationId}`, JSON.stringify(existingMessages));

      for (const [, clientData] of clients) {
        if (clientData.conversationId === conversationId && clientData.socket.readyState === WebSocket.OPEN) {
          clientData.socket.send(JSON.stringify({
            type: 'message',
            from: 'admin',
            name: 'You',
            text: sanitizedText,
            timestamp: now,
          }));
        }
      }

      return new Response(JSON.stringify({ ok: true, reply_sent: true, conversation_id: conversationId }), {
        headers: { 'Content-Type': 'application/json' },
      });
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
  const url = new URL(request.url);
  const conversationId = url.searchParams.get('conversation_id');
  const origin = request.headers.get('Origin') || '';

  if (!conversationId) {
    return new Response(JSON.stringify({ error: 'conversation_id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const messagesStr = await env.CHAT_KV.get(`conv_messages:${conversationId}`);
  const messages: StoredMessage[] = messagesStr ? JSON.parse(messagesStr) : [];

  return new Response(JSON.stringify({ messages }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function handlePollMessages(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const since = parseInt(url.searchParams.get('since') || '0');
  const conversationId = url.searchParams.get('conversation_id');
  const origin = request.headers.get('Origin') || '';

  if (!conversationId) {
    return new Response(JSON.stringify({ messages: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  const messagesStr = await env.CHAT_KV.get(`conv_messages:${conversationId}`);
  const allMessages: StoredMessage[] = messagesStr ? JSON.parse(messagesStr) : [];

  const newMessages = allMessages.filter(m => m.sender_type === 'admin' && m.created_at > since);

  const messagesToReturn = newMessages.map(m => ({
    id: m.id,
    text: m.text,
    timestamp: m.created_at,
    from: 'admin',
    name: 'You'
  }));

  return new Response(JSON.stringify({
    messages: messagesToReturn
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function handlePresence(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || '';
  const cors = corsHeaders(origin);

  if (request.method === 'GET') {
    const presence = await getPresence(env);
    return new Response(JSON.stringify(presence), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as { state?: string };
      if (body.state) {
        const validStates = ['online', 'offline', 'away'];
        if (!validStates.includes(body.state)) {
          return new Response(JSON.stringify({ error: 'Invalid state' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...cors },
          });
        }
        const presence: Presence = {
          state: body.state as 'online' | 'offline' | 'away',
          updated_at: Date.now(),
          source: 'manual',
        };
        await env.CHAT_KV.put('presence', JSON.stringify(presence));
        return new Response(JSON.stringify({ ok: true, presence }), {
          headers: { 'Content-Type': 'application/json', ...cors },
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}

async function handleConversation(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || '';
  const cors = corsHeaders(origin);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversation_id');

    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'conversation_id required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const conversationStr = await env.CHAT_KV.get(`conversation:${conversationId}`);
    if (!conversationStr) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const conversation = JSON.parse(conversationStr) as Conversation;
    return new Response(JSON.stringify(conversation), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}