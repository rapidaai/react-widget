import {
  AssistantChatContext,
  useAssistantChat,
} from "@/app/hooks/use-assistant-chat";
import { AssistantChatType } from "@/app/types/types.assistant-chat";
import React from "react";

/**
 *
 * @param param0
 * @returns
 */
export const AssistantChatContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const actions = useAssistantChat();

  /**
   *
   */
  return (
    <AssistantChatContext.Provider value={actions}>
      {children}
    </AssistantChatContext.Provider>
  );
};
