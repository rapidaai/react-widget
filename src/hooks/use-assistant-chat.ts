import { EnvironmentContext } from "@/app/contexts/environment-context";
import { useContext } from "react";
import { AssistantChatContext } from "@/app/contexts/assistant-chat-context";

export const useAssistantChat = () => {
  return useContext(AssistantChatContext);
};
