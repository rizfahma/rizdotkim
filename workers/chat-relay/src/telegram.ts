import type { Env, OutgoingMessage } from './types';

export async function sendTelegramMessage(
  env: Env,
  chatId: string,
  text: string,
  replyToMessageId?: number
): Promise<boolean> {
  const payload: OutgoingMessage = {
    name: env.ADMIN_CHAT_ID || 'Admin',
    text,
  };

  if (replyToMessageId) {
    payload.reply_to_message_id = replyToMessageId;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: payload.text,
          parse_mode: 'HTML',
          reply_to_message_id: payload.reply_to_message_id,
        }),
      }
    );

    const result = await response.json() as { ok: boolean };
    return result.ok;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export async function sendTelegramAction(
  env: Env,
  chatId: string,
  action: 'typing' | 'upload_document'
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendChatAction`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          action,
        }),
      }
    );

    const result = await response.json() as { ok: boolean };
    return result.ok;
  } catch (error) {
    console.error('Failed to send Telegram action:', error);
    return false;
  }
}

export function sanitizeText(text: string, maxLength: number = 500): string {
  let sanitized = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function sanitizeName(name: string): string {
  let sanitized = name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .substring(0, 50);

  if (sanitized.length < 1) {
    sanitized = 'Anonymous';
  }

  return sanitized;
}

export function isRateLimited(
  ip: string,
  rateLimitMap: Map<string, { count: number; resetTime: number }>,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return false;
}