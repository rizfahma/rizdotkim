# Chat System: Telegram ↔ Website Real-time Relay

## Overview
A real-time chat widget on a website (riz.kim / fahma.pages.dev) that connects visitors directly to a Telegram bot for two-way communication.

## Architecture
```
┌─────────────────┐      ┌─────────────────────┐      ┌─────────────────┐
│  Website Visitor │ ←──→ │ Cloudflare Worker  │ ←──→ │  Telegram Bot   │
│  (Chat Widget)  │      │ chat-relay.rix888 │      │ rizdotkimbot   │
└─────────────────┘      └─────────────────────┘      └─────────────────┘
```

## Components

### 1. Cloudflare Worker (`workers/chat-relay/`)

**Files:**
- `src/index.ts` - Main worker with all API endpoints
- `src/telegram.ts` - Telegram Bot API helpers
- `src/types.ts` - TypeScript interfaces
- `wrangler.toml` - Worker config

**API Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/send` | POST | Visitor sends message to Telegram |
| `/api/stream` | WebSocket | Real-time messaging (optional) |
| `/api/poll` | GET | Poll for admin replies (polling fallback) |
| `/webhook` | POST | Telegram sends messages here |
| `/api/health` | GET | Health check |

**Secrets (stored in Cloudflare):**
- `TELEGRAM_BOT_TOKEN` = "8312474710:AAHN8VSRi2T8DLtgqgUymNGmun27s4Zm4pQ"
- `ADMIN_CHAT_ID` = "432554828"

**Worker URL:** `https://chat-relay.rix888.workers.dev`

### 2. Chat Widget (`src/components/ChatWidget.tsx`)

**Features:**
- SolidJS component
- Dark theme, glassmorphism
- Position: bottom-left, fixed
- Fields: Name (required), Phone (optional), Telegram (optional), Message
- Starts minimized (bubble only)
- Session persistence via localStorage
- Polls every 1 second for replies

### 3. Integration

Added to all Astro layouts:
- `src/layouts/PageLayout.astro`
- `src/layouts/BottomLayout.astro`
- `src/layouts/ArticleBottomLayout.astro`

```astro
<ChatWidget client:only="solid-js" />
```

## How It Works

### Visitor → You (Working)
1. Visitor fills form (name, phone, telegram, message)
2. POST to `/api/send`
3. Worker sends to Telegram via Bot API
4. You receive message on Telegram

### You → Visitor (NOT WORKING - Issue)
1. You send message on Telegram
2. Telegram sends webhook to `/webhook`
3. Worker adds message to `adminMessages` array
4. Visitor polls `/api/poll` every 1 second
5. Message should appear on chat

## Current Issues

### Issue: Two-way communication broken
- Visitor → Admin works (messages arrive on Telegram)
- Admin → Visitor does NOT work (polling returns empty)

### Debug Commands
```bash
# Check if worker is running
curl https://chat-relay.rix888.workers.dev/api/health

# Check message queue
curl https://chat-relay.rix888.workers.dev/api/debug

# Test send from web
curl -X POST https://chat-relay.rix888.workers.dev/api/send \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "text": "Hello"}'

# Test poll
curl "https://chat-relay.rix888.workers.dev/api/poll?since=0"

# Test webhook manually
curl -X POST https://chat-relay.rix888.workers.dev/webhook \
  -H "Content-Type: application/json" \
  -d '{"update_id":1,"message":{"message_id":1,"from":{"id":432554828},"chat":{"id":432554828},"text":"Hello"}}'
```

## Telegram Bot Setup
- Bot: @rizdotkimbot
- Token: 8312474710:AAHN8VSRi2T8DLtgqgUymNGmun27s4Zm4pQ
- Webhook set: `https://api.telegram.org/botTOKEN/setWebhook?url=https://chat-relay.rix888.workers.dev/webhook`

## Files Structure
```
rizdotkim/
├── workers/chat-relay/
│   ├── src/
│   │   ├── index.ts      (main worker)
│   │   ├── telegram.ts   (Bot API helpers)
│   │   └── types.ts     (TypeScript types)
│   ├── wrangler.toml
│   └── package.json
├── src/
│   └── components/
│       └── ChatWidget.tsx  (SolidJS chat UI)
├── src/layouts/
│   ├── PageLayout.astro
│   ├── BottomLayout.astro
│   └── ArticleBottomLayout.astro
└── dist/  (built files)
```

## Expected Behavior

### Working (Visitor → Admin)
```javascript
// Visitor sends message
{ name: "John", phone: "+1234567890", telegram: "johndoe", text: "Hello" }

// Telegram receives:
👤 John | 📱 +1234567890 | 📨 @johndoe
📝 Hello

💬 Just reply with any message to send to the visitor!
```

### Should Work But Doesn't (Admin → Visitor)
```javascript
// Admin sends ANY message on Telegram: "Hi there!"

// Visitor polls /api/poll?since=0
{ messages: [{ id: "reply_123", text: "Hi there!", from: "admin", name: "You" }] }

// Should appear in chat widget
```

## Deployment Commands

```bash
# Deploy Worker
cd workers/chat-relay
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx wrangler deploy

# Build Site
cd /
npm run build

# Set webhook
curl "https://api.telegram.org/botTOKEN/setWebhook?url=https://chat-relay.workers.dev/webhook"
```

## Known Problems

1. **Admin replies don't reach visitors**
   - Webhook receives admin messages (verified)
   - Messages added to adminMessages array (verified)
   - Polling returns empty arrays (BUG)

2. **Possible causes:**
   - Chat ID comparison issue (ADMIN_CHAT_ID not matching)
   - adminMessages array being cleared
   - CORS blocking poll responses

## What Needs Fixing

The `/api/poll` endpoint should return messages when the admin sends from Telegram. Currently it returns `{"messages":[]}` even after sending messages via webhook.

---
Last Updated: 2026-04-21