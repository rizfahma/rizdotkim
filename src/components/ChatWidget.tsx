import { createSignal, Show } from 'solid-js';

const TELEGRAM_BOT_URL = 'https://t.me/rizdotkimbot';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = createSignal(false);

  function openTelegram() {
    window.open(TELEGRAM_BOT_URL, '_blank');
    setIsOpen(false);
  }

  return (
    <div class="chat-widget">
      <style>{`
        .chat-widget { position: fixed; bottom: 24px; left: 24px; z-index: 9999; }
        .chat-bubble { width: 48px; height: 48px; border: 1px solid rgba(226, 232, 240, 0.5); background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; color: #64748b; }
        .chat-bubble:hover { color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); background: rgba(239, 246, 255, 0.95); }
        .chat-bubble svg { width: 20px; height: 20px; fill: currentColor; }
        .chat-tooltip { position: absolute; bottom: 60px; left: 0; border: 1px solid rgba(226, 232, 240, 0.5); background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-radius: 8px; padding: 8px 14px; white-space: nowrap; animation: widgetIn 0.15s ease; }
        @keyframes widgetIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .chat-tooltip-text { color: #64748b; font-size: 12px; font-family: "Inter", sans-serif; font-weight: 500; }
        @media (max-width: 480px) { .chat-widget { bottom: 16px; left: 16px; } .chat-bubble { width: 42px; height: 42px; } .chat-tooltip { bottom: 52px; } }
      `}</style>
      <Show when={isOpen()}>
        <div class="chat-tooltip"><span class="chat-tooltip-text">Chat on Telegram</span></div>
      </Show>
      <button class="chat-bubble" onClick={() => isOpen() ? openTelegram() : setIsOpen(true)} title="Chat on Telegram">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>
    </div>
  );
}
