import { useCallback, useState } from "react";
import {
  AssistantMessagingResponse,
  MessageFeedbackResponse,
} from "@/app/clients/protos/talk-api_pb";
import { ClientAuthInfo, UserAuthInfo } from "@/app/clients";
import { ServiceError } from "@/app/clients/protos/assistant-api_pb_service";
import { MessageFeedback } from "@/app/clients/talk";

export interface MessageActionParams {
  assistantId: string;
  assistantConversationId: string;
  auth: UserAuthInfo | ClientAuthInfo;
}

export const useMessageAction = ({
  assistantId,
  assistantConversationId,
  auth,
}: MessageActionParams) => {
  //
  //
  //
  const afterMessageFeedback = useCallback(
    (err: ServiceError | null, uvcr: MessageFeedbackResponse | null) => {},
    []
  );

  //
  //
  const onLikeMessage = (assistantConverstaionMessageId: string) => {
    MessageFeedback(
      assistantId,
      assistantConversationId,
      assistantConverstaionMessageId,
      "liked",
      auth,
      afterMessageFeedback
    );
  };

  const onDislikeMessage = (assistantConverstaionMessageId: string) => {
    MessageFeedback(
      assistantId,
      assistantConversationId,
      assistantConverstaionMessageId,
      "disliked",
      auth,
      afterMessageFeedback
    );
  };

  return {
    onLikeMessage,
    onDislikeMessage,
  };
};
