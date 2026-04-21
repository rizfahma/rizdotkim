import { createSignal, Show } from 'solid-js';

const TELEGRAM_BOT_URL = 'https://t.me/rizkim_bot';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = createSignal(false);

  function openTelegram() {
    window.open(TELEGRAM_BOT_URL, '_blank');
    setIsOpen(false);
  }

  return (
    <div class="chat-widget">
      <style>{`
        .chat-widget {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 9999;
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

        .chat-tooltip {
          position: absolute;
          bottom: 72px;
          left: 0;
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          white-space: nowrap;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-tooltip-text {
          color: #e0e0e0;
          font-size: 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        @media (max-width: 480px) {
          .chat-widget {
            bottom: 16px;
            left: 16px;
          }

          .chat-bubble {
            width: 48px;
            height: 48px;
          }

          .chat-tooltip {
            bottom: 64px;
          }
        }
      `}</style>

      <Show when={isOpen()}>
        <div class="chat-tooltip">
          <span class="chat-tooltip-text">Chat on Telegram</span>
        </div>
      </Show>

      <button
        class="chat-bubble"
        onClick={() => isOpen() ? openTelegram() : setIsOpen(true)}
        title="Chat on Telegram"
      >
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>
    </div>
  );
}