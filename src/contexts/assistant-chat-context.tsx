import React, { useContext } from "react";

import {
  AssistantChatContext,
  useAssistantChat,
} from "@/hooks/use-assistant-chat";
import { AssistantChatType } from "@/types/types.assistant-chat";

export const useAssistantChatContext = (): AssistantChatType => {
  const context = useContext(AssistantChatContext);
  if (!context) {
    throw new Error(
      "useAssistantChatContext must be used within a DarkModeProvider"
    );
  }
  return context;
};

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
