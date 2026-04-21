export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  ADMIN_CHAT_ID: string;
  WORKER_URL: string;
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
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
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