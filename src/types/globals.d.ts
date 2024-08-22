interface ChatbotConfig {
  assistant_id?: string;
  assistant_version?: string;
  api_base?: string;
  token?: string;
  user?: {
    name: string;
    user_id?: string;
    meta?: Record<string, string>;
  };
  debug?: boolean;
}

interface Window {
  chatbotConfig?: ChatbotConfig;
}
