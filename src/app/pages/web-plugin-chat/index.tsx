import { FC } from "react";
import { VoiceAgent } from "@rapidaai/react";
import { ChatComponent } from "@/app/pages/v3";
import { useAssistantDeployment } from "@/hooks/use-assistant-deployment/useAssistantDeployment";
import type { ChatbotConfig } from "@/types/widget";

interface WebPluginChatProps {
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  themeMode?: "light" | "dark" | "system";
}

export const WebPluginChat: FC<WebPluginChatProps> = ({
  voiceAgent,
  config,
  themeMode,
}) => {
  const state = useAssistantDeployment(voiceAgent);

  if (state.status === "ready") {
    return (
      <ChatComponent
        deployment={state.deployment}
        voiceAgent={voiceAgent}
        config={config}
        themeMode={themeMode}
      />
    );
  }

  if (state.status === "error") {
    console.error("[Rapida Widget]", state.error);
  }

  // Loading or error — render nothing in production,
  // but log errors to console for debugging
  return null;
};
