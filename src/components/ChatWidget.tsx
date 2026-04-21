import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';

interface Message {
  id: string;
  from: 'visitor' | 'admin';
  name: string;
  text: string;
  timestamp: number;
}

const WORKER_URL = 'https://chat-relay.rix888.workers.dev';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isConnected, setIsConnected] = createSignal(false);
  const [isTryingConnect, setIsTryingConnect] = createSignal(true);
  const [nameInput, setNameInput] = createSignal('');
  const [phoneInput, setPhoneInput] = createSignal('');
  const [telegramInput, setTelegramInput] = createSignal('');
  const [messageInput, setMessageInput] = createSignal('');
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [isSending, setIsSending] = createSignal(false);
  const [showNameInput, setShowNameInput] = createSignal(true);
  const [showContactInput, setShowContactInput] = createSignal(true);

  let socket: WebSocket | null = null;
  let messagesEndRef: HTMLDivElement | undefined;
  let typingInterval: number | undefined;

  const STORAGE_KEY = 'rizkim_chat_messages';
  const NAME_KEY = 'rizkim_chat_name';
  const PHONE_KEY = 'rizkim_chat_phone';
  const TELEGRAM_KEY = 'rizkim_chat_telegram';

  onMount(() => {
    const savedName = localStorage.getItem(NAME_KEY);
    const savedPhone = localStorage.getItem(PHONE_KEY);
    const savedTelegram = localStorage.getItem(TELEGRAM_KEY);
    
    if (savedName) {
      setNameInput(savedName);
      setShowNameInput(false);
    }
    if (savedPhone) setPhoneInput(savedPhone);
    if (savedTelegram) setTelegramInput(savedTelegram);
    if (savedName && (savedPhone || savedTelegram)) {
      setShowContactInput(false);
    }

    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed.slice(-50));
        }
      } catch (e) {
        console.error('Failed to load saved messages:', e);
      }
    }

    if (isOpen()) {
      connectWebSocket();
    }
    typingInterval = window.setInterval(() => {
      checkTyping();
      pollForAdminMessages();
    }, 2000);
  });

  onCleanup(() => {
    if (socket) {
      socket.close();
    }
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  });

  function clearChatHistory() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NAME_KEY);
    setMessages([]);
    setNameInput('');
    setShowNameInput(true);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', clearChatHistory);
  }

  function saveMessages(msgs: Message[]) {
    const toSave = msgs.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  function sanitize(str: string): string {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .substring(0, 500);
  }

  function validateName(name: string): boolean {
    return /^[a-zA-Z0-9 ]{1,50}$/.test(name);
  }

  async function connectWebSocket() {
    setIsTryingConnect(true);

    try {
      socket = new WebSocket(`${WORKER_URL.replace('https', 'wss')}/api/stream`);

      socket.onopen = () => {
        setIsConnected(true);
        setIsTryingConnect(false);
        setError(null);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'message') {
            const newMsg: Message = {
              id: crypto.randomUUID(),
              from: data.from,
              name: data.name,
              text: data.text,
              timestamp: data.timestamp,
            };

            setMessages((prev) => {
              const updated = [...prev, newMsg];
              saveMessages(updated);
              return updated;
            });

            scrollToBottom();
          }
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        setIsTryingConnect(false);
        setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = () => {
        setIsConnected(false);
        setIsTryingConnect(false);
      };
    } catch (e) {
      console.error('WebSocket error:', e);
      setIsTryingConnect(false);
    }
  }

  async function checkTyping() {
    if (!isOpen()) return;

    try {
      const last = messages().slice(-1)[0]?.timestamp || 0;
      const resp = await fetch(`${WORKER_URL}/api/typing?last=${last}`);
      const data = await resp.json();
    } catch (e) {
      console.error('Typing check failed:', e);
    }
  }

  async function pollForAdminMessages() {
    if (!isOpen()) return;

    try {
      const lastTs = messages().slice(-1)[0]?.timestamp || 0;
      const resp = await fetch(`${WORKER_URL}/api/poll?since=${lastTs}`);
      if (!resp.ok) return;
      
      const data = await resp.json();
      if (data.messages && Array.isArray(data.messages)) {
        for (const msg of data.messages) {
          const newMsg: Message = {
            id: msg.id || crypto.randomUUID(),
            from: 'admin',
            name: msg.name,
            text: msg.text,
            timestamp: msg.timestamp,
          };
          setMessages((prev) => {
            const exists = prev.some(m => m.id === newMsg.id);
            if (exists) return prev;
            const updated = [...prev, newMsg];
            saveMessages(updated);
            return updated;
          });
        }
        if (data.messages.length > 0) {
          scrollToBottom();
        }
      }
    } catch (e) {
      console.error('Poll failed:', e);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function validateContact(contact: string): boolean {
    if (!contact) return true;
    return /^[a-zA-Z0-9@_+.-]{3,50}$/.test(contact);
  }

  async function sendMessage() {
    const name = nameInput().trim();
    const phone = phoneInput().trim();
    const telegram = telegramInput().trim();
    const text = messageInput().trim();

    if (!name && showNameInput()) {
      setError('Please enter your name');
      return;
    }

    if (!validateName(name)) {
      setError('Name can only contain letters, numbers, and spaces (max 50 chars)');
      return;
    }

    if (phone && !/^[0-9+]{5,20}$/.test(phone)) {
      setError('Invalid phone number format');
      return;
    }

    if (telegram && !validateContact(telegram)) {
      setError('Invalid Telegram handle (e.g., @username)');
      return;
    }

    if (!text) {
      setError('Please enter a message');
      return;
    }

    if (showNameInput()) {
      localStorage.setItem(NAME_KEY, name);
      setShowNameInput(false);
    }
    if (phone) {
      localStorage.setItem(PHONE_KEY, phone);
    }
    if (telegram) {
      localStorage.setItem(TELEGRAM_KEY, telegram);
    }
    if (phone || telegram) {
      setShowContactInput(false);
    }

    setError(null);
    setIsSending(true);

    const contactInfo = [];
    if (phone) contactInfo.push(`📱 ${phone}`);
    if (telegram) contactInfo.push(`📨 @${telegram.replace('@', '')}`);
    const contactStr = contactInfo.length > 0 ? `\n${contactInfo.join(' | ')}` : '';

    try {
      const resp = await fetch(`${WORKER_URL}/api/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: showNameInput() ? name : localStorage.getItem(NAME_KEY) || 'Anonymous',
          phone: phone || undefined,
          telegram: telegram || undefined,
          text: sanitize(text) + contactStr,
        }),
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        throw new Error(data.error || 'Failed to send');
      }

      const newMsg: Message = {
        id: crypto.randomUUID(),
        from: 'visitor',
        name: name,
        text: sanitize(text),
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        saveMessages(updated);
        return updated;
      });

      setMessageInput('');
      scrollToBottom();
    } catch (e: any) {
      setError(e.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div class="chat-widget">
      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .chat-bubble {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #1a1a2e;
          border: 1px solid #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .chat-bubble:hover {
          transform: scale(1.05);
          background: #252540;
        }

        .chat-bubble svg {
          width: 24px;
          height: 24px;
          fill: #e0e0e0;
        }

        .chat-window {
          position: absolute;
          bottom: 72px;
          left: 0;
          width: 360px;
          height: 480px;
          background: #0f0f1a;
          border: 1px solid #2a2a40;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #1a1a2e;
          border-bottom: 1px solid #2a2a40;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
        }

        .status-dot.connected {
          background: #22c55e;
        }

        .status-dot.connecting {
          background: #eab308;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          color: #888;
          font-size: 13px;
        }

        .chat-title {
          color: #e0e0e0;
          font-weight: 600;
          font-size: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          display: flex;
        }

        .close-btn:hover {
          color: #e0e0e0;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #0f0f1a;
        }

        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 2px;
        }

        .message {
          max-width: 80%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.4;
        }

        .message.visitor {
          align-self: flex-end;
          background: #3b82f6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.admin {
          align-self: flex-start;
          background: #1e1e30;
          color: #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .message-name {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 2px;
        }

        .message-time {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          text-align: right;
          margin-top: 4px;
        }

        .chat-input {
          padding: 12px;
          background: #1a1a2e;
          border-top: 1px solid #2a2a40;
        }

        .chat-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .visitor-name-input {
          width: 100%;
          background: #0f0f1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 10px 12px;
          color: #e0e0e0;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .visitor-name-input::placeholder {
          color: #555;
        }

        .visitor-name-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .contact-inputs {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
        }

        .contact-inputs .visitor-name-input {
          margin-bottom: 0;
        }

        .message-input {
          flex: 1;
          background: #0f0f1a;
          border: 1px solid #333;
          border-radius: 24px;
          padding: 10px 16px;
          color: #e0e0e0;
          font-size: 14px;
        }

        .message-input::placeholder {
          color: #555;
        }

        .message-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3b82f6;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #2563eb;
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-btn svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        .chat-error {
          color: #f87171;
          font-size: 12px;
          padding: 4px 0;
        }

        .no-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 14px;
          text-align: center;
          padding: 24px;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 24px);
            height: calc(100vh - 120px);
            left: 0;
          }

          .chat-widget {
            bottom: 16px;
            left: 16px;
          }
        }
      `}</style>

      <Show when={isOpen()}>
        <div class="chat-window">
          <div class="chat-header">
            <div class="chat-header-left">
              <div class={`status-dot ${isConnected() ? 'connected' : isTryingConnect() ? 'connecting' : ''}`} />
              <span class="status-text">
                {isConnected() ? 'Connected' : isTryingConnect() ? 'Connecting...' : 'Offline'}
              </span>
            </div>
            <span class="chat-title">Chat</span>
            <button class="close-btn" onClick={() => setIsOpen(false)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="chat-messages">
            <Show when={messages().length === 0}>
              <div class="no-messages">
                <p>👋 Hi! I'm a real-time chat relay to Telegram.</p>
                <p style="margin-top: 8px; font-size: 13px;">Enter your name and message below to get started.</p>
              </div>
            </Show>

            <For each={messages()}>
              {(msg) => (
                <div class={`message ${msg.from}`}>
                  <Show when={msg.from === 'visitor'}>
                    <div class="message-name">{msg.name}</div>
                  </Show>
                  <div innerHTML={msg.text} />
                  <div class="message-time">{formatTime(msg.timestamp)}</div>
                </div>
              )}
            </For>
            <div ref={messagesEndRef} />
          </div>

          <div class="chat-input">
            <Show when={error()}>
              <div class="chat-error">{error()}</div>
            </Show>

            <Show when={showNameInput()}>
              <input
                type="text"
                class="visitor-name-input"
                placeholder="Your name..."
                value={nameInput()}
                onInput={(e) => setNameInput(e.currentTarget.value)}
                maxLength={50}
              />
            </Show>

            <Show when={showContactInput() && !showNameInput()}>
              <div class="contact-inputs">
                <input
                  type="text"
                  class="visitor-name-input"
                  placeholder="Phone (optional) +1234567890"
                  value={phoneInput()}
                  onInput={(e) => setPhoneInput(e.currentTarget.value)}
                  maxLength={20}
                />
                <input
                  type="text"
                  class="visitor-name-input"
                  placeholder="Telegram (optional) @username"
                  value={telegramInput()}
                  onInput={(e) => setTelegramInput(e.currentTarget.value)}
                  maxLength={50}
                />
              </div>
            </Show>

            <div class="chat-input-row">
              <input
                type="text"
                class="message-input"
                placeholder="Type a message..."
                value={messageInput()}
                onInput={(e) => setMessageInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
              />
              <button
                class="send-btn"
                onClick={sendMessage}
                disabled={isSending() || !messageInput().trim()}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Show>

      <button
        class="chat-bubble"
        onClick={() => setIsOpen(!isOpen())}
        title="Open chat"
      >
        <Show when={!isOpen()}>
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </Show>
        <Show when={isOpen()}>
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </Show>
      </button>
    </div>
  );
}