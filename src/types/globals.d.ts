interface ChatbotConfig {
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

  /** Bot display name shown in header. Falls back to deployment name. */
  name?: string;

  /** URL to a logo/avatar image shown in the header. Falls back to text initial. */
  logo_url?: string;

  /**
   * Widget layout mode:
   * - "floating"      — fixed-position panel with launcher FAB (default)
   * - "docked-right"  — panel fixed to right side, pushes page content left
   * - "docked-left"   — panel fixed to left side, pushes page content right
   * - "inline"        — flows with page, no fixed positioning
   */
  layout?: "floating" | "docked-right" | "docked-left" | "inline";

  /** Widget position when layout is "floating" */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";

  /** Show or hide the default launcher button. Only applies to "floating" layout. */
  showLauncher?: boolean;

  theme?: {
    /** Color theme mode */
    mode?: "light" | "dark" | "system";
    /** Primary brand color (hex) */
    color?: string;
  };
}

interface Window {
  chatbotConfig?: ChatbotConfig;
}
