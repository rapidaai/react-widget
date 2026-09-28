import type { ChatbotConfig } from "./widget";

declare global {
  interface Window {
    chatbotConfig?: ChatbotConfig;
  }
}

export {};
