import type {
  ChatContainerProps,
  ChatCustomElementProps,
} from "@carbon/ai-chat";
import type { LayoutSettings } from "@/lib/layout/layout";

type AiChatConfig = Partial<
  Omit<ChatCustomElementProps, "className" | "layout"> &
    Omit<ChatContainerProps, "layout">
>;

export interface ChatbotConfig extends AiChatConfig {
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
  name?: string;
  logo_url?: string;
  layout?: LayoutSettings;
  theme?: {
    mode?: "light" | "dark" | "system";
    injectTheme?: ChatContainerProps["injectCarbonTheme"];
  };
}
