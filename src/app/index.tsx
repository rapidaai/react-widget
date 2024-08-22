import { FloatingChatButton } from "@/app/app/float-button";
import { AssistantChatContextProvider } from "@/app/contexts/assistant-chat-context";
import React, { FC, memo } from "react";

export const App: FC<{}> = memo(() => {
  return (
    <div className="!font-sans">
      <AssistantChatContextProvider>
        <FloatingChatButton />
      </AssistantChatContextProvider>
    </div>
  );
});
