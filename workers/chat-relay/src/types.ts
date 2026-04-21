export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  ADMIN_CHAT_ID: string;
  WORKER_URL: string;
  CHAT_KV: KVNamespace;
}

export interface ChatMessage {
  id: string;
  from: 'visitor' | 'admin';
  name: string;
  text: string;
  timestamp: number;
}

export interface SendMessageRequest {
  name: string;
  text: string;
  phone?: string;
  telegram?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    reply_to_message_id?: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name?: string;
      last_name?: string;
      username?: string;
      phone_number?: string;
    };
    chat: {
      id: number;
      type: string;
      username?: string;
      first_name?: string;
    };
    text?: string;
    contact?: {
      phone_number?: string;
      first_name?: string;
    };
  };
}

export interface OutgoingMessage {
  name: string;
  text: string;
  reply_to_message_id?: number;
}

export interface Conversation {
  id: string;
  session_id: string;
  status: 'active' | 'closed';
  created_at: number;
  updated_at: number;
  last_seen_at: number;
  page_url?: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_telegram?: string;
  telegram_message_id?: number;
}

export interface StoredMessage {
  id: string;
  conversation_id: string;
  sender_type: 'visitor' | 'admin';
  text: string;
  telegram_message_id?: number;
  created_at: number;
  delivered: boolean;
}

export interface Presence {
  state: 'online' | 'away' | 'offline';
  updated_at: number;
  source: 'manual' | 'auto';
}