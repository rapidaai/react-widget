# @rapidaai/web-widget

Embeddable voice + text AI agent widget. Drop a single script tag into any website to add an intelligent chat assistant powered by [Rapida](https://rapida.ai).

[![CI](https://github.com/rapidaai/react-widget/actions/workflows/ci.yml/badge.svg)](https://github.com/rapidaai/react-widget/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@rapidaai/web-widget)](https://www.npmjs.com/package/@rapidaai/web-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Quick Start

Add the widget to any HTML page with two lines:

```html
<script>
  window.chatbotConfig = {
    assistant_id: "YOUR_ASSISTANT_ID",
    token: "YOUR_API_KEY",
  };
</script>
<script src="https://cdn-01.rapida.ai/public/scripts/app.min.js"></script>
```

That's it. A floating chat button appears in the bottom-right corner of your page.

## Installation

### CDN (recommended)

Use the latest version:

```html
<script src="https://cdn-01.rapida.ai/public/scripts/app.min.js"></script>
```

Pin to a specific version:

```html
<script src="https://cdn-01.rapida.ai/public/scripts/v1.2.0/app.min.js"></script>
```

### npm

```bash
npm install @rapidaai/web-widget
```

Then import the built file from `dist/app.min.js` in your bundler or serve it statically.

## Configuration

Set `window.chatbotConfig` **before** loading the script:

```html
<script>
  window.chatbotConfig = {
    // Required
    assistant_id: "your-assistant-id",
    token: "your-api-key",

    // Optional — API endpoint (defaults to Rapida cloud)
    api_base: "https://assistant-01.in.rapida.ai",

    // Optional — user identity
    user: {
      name: "Jane Doe",
      user_id: "user-123",
      meta: { plan: "pro" },
    },

    // Optional — appearance
    name: "Support Bot",
    logo_url: "https://example.com/avatar.png",
    layout: "floating",          // "floating" | "docked-right" | "docked-left" | "inline"
    position: "bottom-right",    // "bottom-right" | "bottom-left" | "top-right" | "top-left"
    showLauncher: true,

    // Optional — theme
    theme: {
      mode: "light",             // "light" | "dark" | "system"
      color: "#2663eb",          // primary brand color (hex)
    },

    // Optional — misc
    language: "en",
    assistant_version: "latest",
    debug: false,
  };
</script>
```

### Configuration Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `assistant_id` | `string` | — | **Required.** Your Rapida assistant ID. |
| `token` | `string` | — | **Required.** API key for authentication. |
| `api_base` | `string` | `https://assistant-01.in.rapida.ai` | Custom API endpoint URL. |
| `user.name` | `string` | `"Guest"` | Display name for the user. |
| `user.user_id` | `string` | auto-generated | Unique user identifier. Persisted in localStorage. |
| `user.meta` | `Record<string, string>` | `{ source: "web plugin" }` | Custom metadata sent with each message. |
| `name` | `string` | deployment name | Bot display name shown in the chat header. |
| `logo_url` | `string` | — | URL to bot avatar image. Falls back to a default icon. |
| `layout` | `string` | `"floating"` | Widget layout mode. |
| `position` | `string` | `"bottom-right"` | Launcher position (floating layout only). |
| `showLauncher` | `boolean` | `true` | Show/hide the launcher button (floating layout only). |
| `theme.mode` | `string` | `"light"` | Color scheme: `"light"`, `"dark"`, or `"system"`. |
| `theme.color` | `string` | `"#2663eb"` | Primary brand color as hex. |
| `language` | `string` | `"en"` | Language code. Automatically follows `<html lang>` changes. |
| `debug` | `boolean` | `false` | Enable debug logging in the console. |

## Layout Modes

### Floating (default)

A fixed-position panel with a launcher FAB. Click the button to open/close the chat.

```js
window.chatbotConfig = {
  layout: "floating",
  position: "bottom-right",    // or "bottom-left", "top-right", "top-left"
  showLauncher: true,
};
```

### Docked

Panel fixed to the side of the viewport. Pushes page content to make room.

```js
window.chatbotConfig = {
  layout: "docked-right",     // or "docked-left"
};
```

### Inline

Flows with the page content. Place the `<div id="rapida-chat-app">` where you want it.

```js
window.chatbotConfig = {
  layout: "inline",
};
```

## Features

- **Text + Voice** — type messages or speak with your assistant using WebRTC
- **Markdown rendering** — assistant responses render as rich Markdown
- **Microphone device selector** — choose input device during voice conversations
- **Dark mode** — automatic or manual light/dark theme switching
- **Responsive** — works on desktop and mobile browsers
- **Single file** — one `app.min.js` bundle, no external dependencies to load
- **Versioned CDN** — pin to a specific version or always use the latest

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Commands

```bash
npm start              # Dev mode with watch (serves at webpack-dev-server)
npm run build          # Production build → dist/app.min.js
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Project Structure

```
src/
├── index.tsx                    # Entry point, mounts React app
├── app/
│   ├── index.tsx                # App root — creates VoiceAgent
│   └── pages/
│       ├── web-plugin-chat/     # Deployment loader
│       └── v3/
│           ├── index.tsx        # Chat UI (messages, header, launcher)
│           └── input.tsx        # Text/voice input + device selector
├── contexts/
│   ├── environment-context.tsx  # Config from window.chatbotConfig
│   └── dark-mode-context.tsx    # Theme management
├── hooks/
│   └── use-environment.ts       # Environment context hook
├── configs/
│   └── index.ts                 # API base URL + constants
├── styles/
│   └── index.css                # All widget styles (prefixed with rpd-)
├── types/
│   ├── globals.d.ts             # ChatbotConfig type definition
│   └── types.rapida.ts          # Shared types
└── utils/
    └── time.ts                  # Time formatting helpers
```

## CI/CD

On push to `main`:

1. **Build** — `npm ci && npm run build`
2. **CDN** — uploads `dist/app.min.js` to S3 with CloudFront invalidation
3. **npm** — publishes to npm as `@rapidaai/web-widget`
4. **Release** — creates a GitHub release with a version tag

Pull requests run the CI pipeline (build + test) without deploying.

## License

[MIT](LICENSE)
