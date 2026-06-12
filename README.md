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

    // Optional - API endpoint (defaults to Rapida cloud)
    api_base: "https://assistant-01.in.rapida.ai",

    // Optional - user identity
    user: {
      name: "Jane Doe",
      user_id: "user-123",
      meta: { plan: "pro" },
    },

    // Optional - identity
    name: "Support Bot",
    logo_url: "https://example.com/avatar.png",

    // Optional - layout section
    layout: {
      mode: "floating",          // "floating" | "docked-right" | "docked-left" | "inline"
      position: "bottom-right",  // "bottom-right" | "bottom-left" | "top-right" | "top-left"
      corners: "square",
      showFrame: true,
    },

    // Optional - theme section
    theme: {
      mode: "light",             // "light" | "dark" | "system"
      injectTheme: "g10",        // "white" | "g10" | "g90" | "g100"
    },

    // Optional - AI Chat sections
    aiEnabled: false,
    header: {
      title: "Support Bot",
      showAiLabel: false,
      minimizeButtonIconType: "side-panel-right",
    },
    launcher: {
      isOn: true,
    },
    history: {
      isOn: false,
    },
    messaging: {
      messageTimeoutSecs: 150,
      messageLoadingIndicatorTimeoutSecs: 1,
    },

    // Optional - misc
    language: "en",
    assistant_version: "latest",
    debug: false,
  };
</script>
```

### Configuration Model

The widget has two configuration layers:

- **Rapida layer**: connection, authentication, user identity, message bridge, and audio controls.
- **UI layer**: native IBM AI Chat configuration exposed directly on `window.chatbotConfig`.

Rapida always owns `messaging.customSendMessage` because text messages must go through `@rapidaai/react`. Rapida also appends its audio controls through `renderWriteableElements.afterInputElement`; if you provide your own `afterInputElement`, it is preserved and Rapida audio is appended after it.

Use the sectioned config shape below. Do not use a `carbon` config key.

### Required Rapida Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `assistant_id` | `string` | required | Rapida assistant/deployment ID. |
| `token` | `string` | required | Public web plugin token used to authenticate the widget. |

### Rapida Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `api_base` | `string` | `https://assistant-01.in.rapida.ai` | Rapida API base URL. Use this for local or environment-specific backends. |
| `assistant_version` | `string` | `latest` | Assistant version to load when the backend supports versioned deployments. |
| `user.name` | `string` | `Guest` | Display name for the current user. |
| `user.user_id` | `string` | generated and stored locally | Stable user ID. Provide one if your host app already has an authenticated user ID. |
| `user.meta` | `Record<string, string>` | `{ source: "web plugin" }` | Extra metadata sent to Rapida with the user session. |
| `language` | `string` | host page language or `en` | Locale/language passed to the UI. The widget also watches `<html lang>`. |
| `debug` | `boolean` | `false` | Enables additional client logging. Also passed to the UI layer. |
| `name` | `string` | deployment name | Friendly assistant name. Used as the default `assistantName` and `header.title`. |
| `logo_url` | `string` | default assistant avatar | Assistant avatar URL. Used as the default `assistantAvatarUrl`. |

### Theme Options

Use `theme` for all theme-level options.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme.mode` | `"light" \| "dark" \| "system"` | `"light"` | Widget color mode. `dark` defaults the UI token injection to `g100`; `light` defaults it to `g10`; `system` lets the host/system decide unless `theme.injectTheme` is set. |
| `theme.injectTheme` | `"white" \| "g10" \| "g90" \| "g100"` | derived from `theme.mode` | UI theme token injected into the chat shadow DOM. Set this when the host page does not already provide compatible theme tokens. |
| `theme.color` | `string` | none | Legacy primary brand color. Prefer `layout.customProperties` for current UI customization. |

### Layout Options

`layout` can be a string for old embeds or an object for the current sectioned config.

```js
window.chatbotConfig = {
  layout: {
    mode: "floating",
    position: "bottom-right",
    corners: "square",
    showFrame: true,
    customProperties: {
      width: "420px",
      height: "640px",
    },
  },
};
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout` | `string \| object` | `"floating"` | Widget layout. String values are still supported: `"floating"`, `"docked-right"`, `"docked-left"`, `"inline"`. |
| `layout.mode` | `"floating" \| "docked-right" \| "docked-left" \| "inline"` | `"floating"` | Rapida placement mode. |
| `layout.position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | Floating launcher and panel position. |
| `layout.showLauncher` | `boolean` | `true` for floating | Legacy launcher shortcut inside `layout`. Prefer `launcher.isOn`. |
| `layout.showFrame` | `boolean` | `true` | Keeps the native border and shadow frame. |
| `layout.hasContentMaxWidth` | `boolean` | UI default | Constrains message content to the UI max-width. |
| `layout.corners` | `"round" \| "square" \| object` | `"square"` | Corner style. Use a string for all corners or an object for per-corner control. |
| `layout.customProperties` | `Record<string, string>` | generated for floating | CSS variable overrides for the chat UI. Values are raw CSS strings. |

Per-corner `layout.corners` object:

| Property | Type | Description |
|----------|------|-------------|
| `startStart` | `"round" \| "square"` | Top-left in LTR, top-right in RTL. |
| `startEnd` | `"round" \| "square"` | Top-right in LTR, top-left in RTL. |
| `endStart` | `"round" \| "square"` | Bottom-left in LTR, bottom-right in RTL. |
| `endEnd` | `"round" \| "square"` | Bottom-right in LTR, bottom-left in RTL. |

Supported `layout.customProperties` keys:

| Key | Description |
|-----|-------------|
| `height` | Floating chat height. |
| `max-height` | Floating chat maximum height. |
| `width` | Floating chat width. |
| `min-height` | Floating chat minimum height. |
| `max-width` | Floating chat maximum width. |
| `z-index` | Floating chat z-index. |
| `bottom-position` | Floating panel distance from viewport bottom. |
| `right-position` | Floating panel distance from viewport right. |
| `top-position` | Floating panel distance from viewport top. |
| `left-position` | Floating panel distance from viewport left. |
| `launcher-default-size` | Launcher button size. |
| `launcher-position-bottom` | Launcher distance from viewport bottom. |
| `launcher-position-right` | Launcher distance from viewport right. |
| `launcher-extended-width` | Expanded launcher width. |
| `messages-max-width` | Maximum width for message content. |
| `messages-min-width` | Minimum width for message content. |
| `workspace-min-width` | Minimum width for workspace panels. |
| `card-max-width` | Maximum width for card responses. |
| `launcher-color-background` | Launcher background color. |
| `launcher-color-avatar` | Launcher icon/avatar color. |
| `launcher-color-background-hover` | Launcher hover background. |
| `launcher-color-background-active` | Launcher active background. |
| `launcher-color-focus-border` | Launcher focus border color. |
| `launcher-mobile-color-text` | Mobile launcher text color. |
| `launcher-expanded-message-color-text` | Expanded launcher text color. |
| `launcher-expanded-message-color-background` | Expanded launcher background. |
| `launcher-expanded-message-color-background-hover` | Expanded launcher hover background. |
| `launcher-expanded-message-color-background-active` | Expanded launcher active background. |
| `launcher-expanded-message-color-focus-border` | Expanded launcher focus border color. |
| `unread-indicator-color-background` | Unread indicator background color. |
| `unread-indicator-color-text` | Unread indicator text color. |

### Header Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `header.isOn` | `boolean` | `true` | Enables the native chat header. Set `false` for a fully embedded/fullscreen experience with your own app header. |
| `header.title` | `string` | `name` or deployment name | Header title. Set `""` to remove the visible title. |
| `header.name` | `string` | UI default | Secondary name shown after the title. Set `""` to remove it. |
| `header.minimizeButtonIconType` | `"close" \| "minimize" \| "side-panel-left" \| "side-panel-right" \| "side-panel-down"` | side-panel icon based on dock side | Icon for the close/minimize button. |
| `header.hideMinimizeButton` | `boolean` | `false` | Hides the close/minimize button. |
| `header.showRestartButton` | `boolean` | `false` | Shows the restart conversation button. |
| `header.menuOptions` | `Array<{ text: string }>` | none | Custom menu options in the header menu. |
| `header.showAiLabel` | `boolean` | `false` | Shows the AI label in the header. Disabled by default. |
| `header.hideDefaultAiLabelContent` | `boolean` | `true` | Hides the default AI label popover content. |
| `header.hasContentMaxWidth` | `boolean` | `false` | Constrains the header to the message content width. |
| `header.actions` | `ToolbarAction[]` | none | Custom header toolbar actions. |

### Launcher Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `launcher.isOn` | `boolean` | `true` for floating, `false` for docked/inline | Shows the floating launcher button. |
| `launcher.showUnreadIndicator` | `boolean` | UI default | Shows the unread dot on the launcher. |
| `launcher.mobile.avatarUrlOverride` | `string` | none | Custom mobile launcher avatar/icon URL. |
| `launcher.mobile.isOn` | `boolean` | `false` | Deprecated expanded call-to-action launcher state. |
| `launcher.mobile.title` | `string` | translated default | Deprecated expanded launcher title. |
| `launcher.mobile.timeToExpand` | `number` | `15` | Deprecated delay before launcher expansion, in seconds. |
| `launcher.desktop.avatarUrlOverride` | `string` | none | Custom desktop launcher avatar/icon URL. |
| `launcher.desktop.isOn` | `boolean` | `false` | Deprecated expanded call-to-action launcher state. |
| `launcher.desktop.title` | `string` | translated default | Deprecated expanded launcher title. |
| `launcher.desktop.timeToExpand` | `number` | `15` | Deprecated delay before launcher expansion, in seconds. |

### History Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `history.isOn` | `boolean` | `false` | Enables the native history panel. |
| `history.showMobileMenu` | `boolean` | `true` | Shows mobile header menu options for new chat and view chats. |
| `history.startClosed` | `boolean` | `false` | Starts history closed and preserves open/closed state across responsive mode changes. |

### Messaging Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `messaging.skipWelcome` | `boolean` | UI default | Starts new conversations without requesting a welcome message. |
| `messaging.messageTimeoutSecs` | `number` | `150` | Message timeout in seconds. Use `0` to disable automatic timeout. |
| `messaging.messageLoadingIndicatorTimeoutSecs` | `number` | `1` | Delay before the UI shows a loading indicator. Use `0` to prevent the UI from showing one automatically. |
| `messaging.customSendMessage` | function | Rapida bridge | Reserved. Rapida overwrites this so text is sent through `@rapidaai/react`. |
| `messaging.customLoadHistory` | function | none | Optional function that returns native history items for the UI. |
| `messaging.showStopButtonImmediately` | `boolean` | `false` | Shows the stop button as soon as a message request starts. |

### Input Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `input.maxInputCharacters` | `number` | `10000` | Maximum characters allowed in the text input. |
| `input.isVisible` | `boolean` | `true` | Shows or hides the main input surface. |
| `input.isDisabled` | `boolean` | `false` | Disables text input. Rapida also disables text input while audio mode is active. |

### Home Screen Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `homescreen.isOn` | `boolean` | `false` | Enables the native home screen before chat. |
| `homescreen.greeting` | `string` | none | Greeting text on the home screen. |
| `homescreen.starters.isOn` | `boolean` | UI default | Shows starter buttons. |
| `homescreen.starters.buttons` | `Array<{ label: string; isSelected?: boolean }>` | none | Starter utterances displayed as buttons. |
| `homescreen.customContentOnly` | `boolean` | `false` | Hides the built-in greeting and starters so custom content can own the home screen. |
| `homescreen.disableReturn` | `boolean` | `false` | Prevents returning to the home screen after a user has sent a message. |

### Upload Options

File upload is experimental in the underlying UI.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `upload.is_on` | `boolean` | `false` | Enables the attachment button. Requires `upload.onFileUpload`. |
| `upload.accept` | `string` | all file types | Accepted MIME types or extensions, same format as the HTML `accept` attribute. |
| `upload.maxFileSizeBytes` | `number` | none | Client-side maximum file size. |
| `upload.maxFiles` | `number` | none | Maximum number of pending files. |
| `upload.onFileUpload` | function | none | Called once per selected file. Return structured data for the pending message. |

### Keyboard Shortcut Options

Keyboard shortcut configuration is experimental in the underlying UI.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `keyboardShortcuts.messageFocusToggle.is_on` | `boolean` | `true` | Enables the message/input focus toggle shortcut. |
| `keyboardShortcuts.messageFocusToggle.key` | `string` | `"F6"` | Primary shortcut key. |
| `keyboardShortcuts.messageFocusToggle.modifiers.alt` | `boolean` | `false` | Requires Alt. |
| `keyboardShortcuts.messageFocusToggle.modifiers.shift` | `boolean` | `false` | Requires Shift. |
| `keyboardShortcuts.messageFocusToggle.modifiers.ctrl` | `boolean` | `false` | Requires Control. |
| `keyboardShortcuts.messageFocusToggle.modifiers.meta` | `boolean` | `false` | Requires Command/Meta. |

### Disclaimer Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disclaimer.isOn` | `boolean` | `false` | Shows a disclaimer screen before chat. |
| `disclaimer.disclaimerHTML` | `string` | required when enabled | HTML content for the disclaimer. If this changes after acceptance, the user must accept again. |

### Service Desk Options

These are advanced native UI options for human-agent handoff integrations.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `serviceDeskFactory` | function | none | Factory that creates a service desk integration instance. |
| `serviceDesk.availabilityTimeoutSeconds` | `number` | UI default | Timeout used while checking whether human agents are available. |
| `serviceDesk.skipConnectHumanAgentCard` | `boolean` | `false` | Auto-connects to an available agent after a connect-to-agent response while still showing the card. |
| `serviceDesk.agentJoinTimeoutSeconds` | `number` | none | Timeout while waiting for an agent to join after one is requested. |
| `serviceDesk.allowReconnect` | `boolean` | `true` | Attempts to reconnect the user to a prior human-agent conversation when supported. |

### Advanced UI Options

These are passed through to the native UI layer. Use them only when the host page needs lower-level control.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `aiEnabled` | `boolean` | `false` | Enables AI visual styling. The widget disables this by default. |
| `assistantName` | `string` | `name` or deployment name | Assistant name used by the UI for accessibility, errors, and defaults. |
| `assistantAvatarUrl` | `string` | `logo_url` | Assistant avatar URL used by native messages. |
| `locale` | `string` | `language` | UI locale. Prefer `language` unless you need to override only the UI. |
| `namespace` | `string` | `"rapida-chat"` | Namespace for DOM IDs, storage keys, and multi-instance isolation. Must be 30 characters or fewer. |
| `openChatByDefault` | `boolean` | `true` for docked/inline, `false` for floating | Opens the chat when it first renders. |
| `shouldSanitizeHTML` | `boolean` | `true` | Sanitizes assistant HTML before rendering. |
| `shouldTakeFocusIfOpensAutomatically` | `boolean` | `false` | Moves focus into the chat when it opens on page load. |
| `disableCustomElementMobileEnhancements` | `boolean` | `false` | Disables mobile enhancements that can conflict with custom element embedding. |
| `isReadonly` | `boolean` | `false` | Puts the chat in read-only mode for viewing old conversations. |
| `persistFeedback` | `boolean` | `false` | Keeps feedback controls visible beyond the latest message. |
| `strings` | partial language pack | UI defaults | Overrides built-in UI strings. |
| `injectCarbonTheme` | `"white" \| "g10" \| "g90" \| "g100"` | derived from `theme` | Raw UI prop. Prefer `theme.injectTheme`. |
| `onError` | function | none | Called for catastrophic UI errors. |

### Render And Lifecycle Hooks

| Property | Type | Description |
|----------|------|-------------|
| `onBeforeRender(instance)` | function | Called before the UI renders. Rapida uses this internally, then calls your handler. |
| `onAfterRender(instance)` | function | Called after the UI renders. |
| `onViewPreChange(event, instance)` | function | Called before the chat opens or closes. Can return a promise to delay the view change. |
| `onViewChange(event, instance)` | function | Called after the chat opens or closes. Rapida uses this to track docked/inline shell state, then calls your handler. |
| `renderUserDefinedResponse` | function | Renders custom `user_defined` response items. |
| `renderCustomMessageFooter` | function | Renders custom message footers. |
| `renderWriteableElements` | object | Renders writable slots. Rapida merges `afterInputElement` with its audio controls. |

### Legacy Shortcuts

These remain supported for old embeds. Prefer the sectioned config above for new usage.

| Property | Replacement |
|----------|-------------|
| `layout: "floating"` | `layout: { mode: "floating" }` |
| `layout: "docked-right"` | `layout: { mode: "docked-right" }` |
| `layout: "docked-left"` | `layout: { mode: "docked-left" }` |
| `layout: "inline"` | `layout: { mode: "inline" }` |
| `position` | `layout.position` |
| `showLauncher` | `launcher.isOn` |

## Layout Modes

### Floating (default)

A fixed-position panel with a launcher FAB. Click the button to open/close the chat.

```js
window.chatbotConfig = {
  layout: {
    mode: "floating",
    position: "bottom-right",    // or "bottom-left", "top-right", "top-left"
  },
  launcher: {
    isOn: true,
  },
};
```

### Docked

Panel fixed to the side of the viewport. Pushes page content to make room.

```js
window.chatbotConfig = {
  layout: {
    mode: "docked-right",     // or "docked-left"
  },
};
```

### Inline

Flows with the page content. Place the `<div id="rapida-chat-app">` where you want it.

```js
window.chatbotConfig = {
  layout: {
    mode: "inline",
  },
};
```

## Features

- **Text + Voice** - type messages or speak with your assistant using WebRTC
- **Markdown rendering** - assistant responses render as rich Markdown
- **Microphone device selector** - choose input device during voice conversations
- **Dark mode** - automatic or manual light/dark theme switching
- **Responsive** - works on desktop and mobile browsers
- **Single file** - one `app.min.js` bundle, no external dependencies to load
- **Versioned CDN** - pin to a specific version or always use the latest

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
npm run build          # Production build -> dist/app.min.js
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Project Structure

```
src/
├── index.tsx                    # Entry point, mounts React app
├── app/
│   ├── index.tsx                # App root, creates VoiceAgent
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
│   └── carbon.scss              # Theme/component styles and widget style overrides
├── types/
│   ├── globals.d.ts             # ChatbotConfig type definition
│   └── types.rapida.ts          # Shared types
└── utils/
    └── time.ts                  # Time formatting helpers
```

## CI/CD

On push to `main`:

1. **Build** - `npm ci && npm run build`
2. **CDN** - uploads `dist/app.min.js` to S3 with CloudFront invalidation
3. **npm** - publishes to npm as `@rapidaai/web-widget`
4. **Release** - creates a GitHub release with a version tag

Pull requests run the CI pipeline (build + test) without deploying.

## License

[MIT](LICENSE)
