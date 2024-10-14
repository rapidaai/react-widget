import React, { FC, memo } from "react";
import { WebPluginChat } from "@/app/pages/web-plugin-chat";
import { AssistantChatContext } from "@/hooks/use-assistant-chat";
import { AssistantChatContextProvider } from "@/contexts/assistant-chat-context";

export const App: FC<{}> = memo(() => {
  return (
    <div className="pks_font-sans">
      <AssistantChatContextProvider>
        <WebPluginChat />
      </AssistantChatContextProvider>
    </div>
  );
});
