import { CSSProperties, FC } from "react";
import {
  AssistantWebpluginDeployment,
  VoiceAgent,
} from "@rapidaai/react";
import { ChatContainer, ChatCustomElement } from "@carbon/ai-chat";
import { useChatController } from "@/hooks/use-chat-controller/useChatController";
import type { ChatbotConfig } from "@/types/widget";

export interface ChatComponentProps {
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  themeMode?: "light" | "dark" | "system";
}

export const ChatComponent: FC<ChatComponentProps> = ({
  deployment,
  voiceAgent,
  config,
  themeMode,
}) => {
  const { chatProps, isCustomElement, shellStyle } = useChatController({
    deployment,
    voiceAgent,
    config,
    environmentThemeMode: themeMode,
  });

  if (!isCustomElement) return <ChatContainer {...chatProps} />;

  return (
    <div style={shellStyle}>
      <ChatCustomElement
        {...chatProps}
        className="rapida-theme-chat"
        style={customElementStyle}
      />
    </div>
  );
};

const customElementStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
};
