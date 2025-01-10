import { useState } from "react";
import { AssistantMessagingResponse } from "@/app/clients/protos/talk-api_pb";
import { AssistantMessageStage, Message } from "@/app/clients/protos/common_pb";
import { toTextContent } from "@/utils/rapida_content";
import { AssistantConversationMessage } from "@/app/clients/protos/common_pb";
import { Status } from "@/app/clients/protos/endpoint-api_pb_service";
import { ClientAuthInfo, UserAuthInfo } from "@/app/clients";
import { useRapidaStore } from "@/hooks/use-rapida-store";
import { useMessageNotification } from "@/app/pages/web-plugin-chat/hooks/use-message-notification";
import { ResponseStream } from "@/app/clients/protos/assistant-api_pb_service";

export interface MessageStreamParams {
  onMessaging: (message: AssistantConversationMessage) => void;
  assistantId: string;
  assistantVersion: string;
  assistantConversationId?: string | null;
  onSend: (
    assistantDefinition: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    auth: UserAuthInfo | ClientAuthInfo
  ) => ResponseStream<AssistantMessagingResponse>;
  auth: UserAuthInfo | ClientAuthInfo;
}

export const useMessageTextStream = ({
  assistantId,
  assistantVersion,
  auth,
  assistantConversationId,
  onMessaging,
  onSend,
}: MessageStreamParams) => {
  const [sending, setSending] = useState(false);
  const { showLoader, hideLoader, loading } = useRapidaStore();

  //
  //
  const {
    onUpdateNotificationStageMessage,
    onUpdateNotificationMessage,
    notificationType,
    notificationMessage,
    onClearNotification,
  } = useMessageNotification();

  const createMessage = (data: string) => {
    const msg = new Message();
    msg.setRole("user");
    msg.addContents(toTextContent(data));
    return msg;
  };

  const onSendingTextMessage = (message: string) => {
    if (sending || loading) return;
    setSending(true);
    onUpdateNotificationMessage("is thinking...");
    const stream = onSend(
      {
        assistantId: assistantId,
        assistantProviderModelId: assistantVersion,
      },
      assistantConversationId ? assistantConversationId : null,
      createMessage(message),
      auth
    );

    stream.on("data", (response: AssistantMessagingResponse) => {
      if (
        response.getDataCase() == AssistantMessagingResponse.DataCase.MESSAGE
      ) {
        // console.dir(response);
        const convo = response.getMessage();
        if (convo) {
          onUpdateNotificationStageMessage(convo.getStagesList());
          onMessaging(convo);
        }
      }
    });

    stream.on("status", (err: Status) => {
      // clearNotification();
      if (err.details) onUpdateNotificationMessage(err.details, "error");
      hideLoader();
      setSending(false);
    });

    stream.on("end", () => {
      onClearNotification();
      hideLoader();
      setSending(false);
    });
  };

  return {
    sending,
    notificationMessage,
    notificationType,
    onUpdateNotificationMessage,
    onSendingTextMessage,
    onClearNotification,
  };
};
