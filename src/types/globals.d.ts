import type {
  ChatContainerProps,
  ChatCustomElementProps,
} from "@carbon/ai-chat";

type WidgetLayoutMode = "floating" | "docked-right" | "docked-left" | "inline";
type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

type AiChatConfig = Partial<
  Omit<ChatCustomElementProps, "className" | "layout"> &
    Omit<ChatContainerProps, "layout">
>;

type LayoutConfig = NonNullable<ChatContainerProps["layout"]> & {
  /** Rapida widget placement mode. */
  mode?: WidgetLayoutMode;
  /** Rapida widget position when mode is "floating". */
  position?: WidgetPosition;
  /** Legacy launcher shortcut. Prefer launcher.isOn for new configs. */
  showLauncher?: boolean;
};

type ThemeConfig = {
  /** Legacy color theme mode. Also used to choose AI Chat theme defaults. */
  mode?: "light" | "dark" | "system";
  /** Legacy primary brand color. Prefer layout.customProperties for UI overrides. */
  color?: string;
  /** Theme token passed to the AI Chat renderer, for example "g10" or "g100". */
  injectTheme?: ChatContainerProps["injectCarbonTheme"];
};

interface ChatbotConfig extends AiChatConfig {
  assistant_id?: string;
  assistant_version?: string;
  api_base?: string;
  token?: string;
  language?: string;
  user?: {
    name: string;
    user_id?: string;
    meta?: Record<string, string>;
  };
  debug?: boolean;

  /** Bot display name. Maps to assistantName/header.title by default. */
  name?: string;

  /** Bot avatar URL. Maps to assistantAvatarUrl by default. */
  logo_url?: string;

  /** Widget layout section. String values remain supported for old embeds. */
  layout?: WidgetLayoutMode | LayoutConfig;

  /** Legacy widget position when layout is "floating". Prefer layout.position. */
  position?: WidgetPosition;

  /** Legacy launcher shortcut. Prefer launcher.isOn for new configs. */
  showLauncher?: boolean;

  /**
   * Theme section for UI theme tokens and legacy widget theme settings.
   *
   * AI Chat config sections such as header, launcher, layout, history,
   * messaging, input, keyboardShortcuts, upload, and homescreen are exposed
   * directly on window.chatbotConfig.
   *
   * `mode` and `color` remain supported for old widget theme settings.
   *
   * Rapida owns:
   * - messaging.customSendMessage
   * - renderWriteableElements.afterInputElement audio controls merge
   *
   * Everything else is passed through to IBM AI Chat.
   */
  theme?: ThemeConfig;
}

declare global {
  interface Window {
    chatbotConfig?: ChatbotConfig;
  }
}

export {};
