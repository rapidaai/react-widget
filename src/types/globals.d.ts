// globals.d.ts

interface ChatbotConfig {
  token: string;
  assistantId: string;
  debug: boolean;
}

interface Window {
  chatbotConfig?: ChatbotConfig;
}
