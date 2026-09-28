import { FC } from "react";
import { VoiceAgent } from "@rapidaai/react";
import { ChatComponent } from "@/app/pages/v3";
import { CatastrophicErrorChat } from "@/components/chat";
import { useAssistantDeployment } from "@/hooks/use-assistant-deployment";
import type { ChatbotConfig } from "@/types";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";

interface WebPluginChatProps {
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  themeMode?: "light" | "dark" | "system";
  conversationHistory?: ConversationHistoryEntry[];
  onRestartConversation?: (entry?: ConversationHistoryEntry) => unknown;
}

export const WebPluginChat: FC<WebPluginChatProps> = ({
  voiceAgent,
  config,
  themeMode,
  conversationHistory,
  onRestartConversation,
}) => {
  const state = useAssistantDeployment(voiceAgent);

  if (state.status === "ready") {
    return (
      <ChatComponent
        deployment={state.deployment}
        voiceAgent={voiceAgent}
        config={config}
        themeMode={themeMode}
        conversationHistory={conversationHistory}
        onRestartConversation={onRestartConversation}
      />
    );
  }

  if (state.status === "error") {
    console.error("[Rapida Widget]", state.error);
    return (
      <CatastrophicErrorChat
        error={state.error}
        config={config}
        themeMode={themeMode}
      />
    );
  }

  // Keep the host page stable while deployment metadata is loading.
  return null;
};
