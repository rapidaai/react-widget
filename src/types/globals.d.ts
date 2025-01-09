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
  theme?: {
    color?: string;
  };
}

interface Window {
  chatbotConfig?: ChatbotConfig;
}
