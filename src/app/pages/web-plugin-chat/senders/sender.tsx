import { ClientAuthInfo, UserAuthInfo } from "@/app/clients";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { ResponseStream } from "@/app/clients/protos/assistant-api_pb_service";
import {
  AssistantConversationMessage,
  Message,
} from "@/app/clients/protos/common_pb";
import { AssistantMessagingResponse } from "@/app/clients/protos/talk-api_pb";
import { AudioSender } from "@/app/pages/web-plugin-chat/senders/audio-sender";
import { TextSender } from "@/app/pages/web-plugin-chat/senders/text-sender";
import { FC, HTMLAttributes, useState } from "react";

/**
 * props for audio sender props
 */
export interface SenderProps extends HTMLAttributes<HTMLFormElement> {
  assistant: Assistant;
  assistantConversationId?: string | null;
  textAreaClassName?: string;
  onMessaging: (msg: AssistantConversationMessage) => void;
  onChangeInputType?: (typ: string) => void;
  auth: ClientAuthInfo | UserAuthInfo;
  onSend: (
    assistantDefinition: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    auth: UserAuthInfo | ClientAuthInfo
  ) => ResponseStream<AssistantMessagingResponse>;
}

//
//
export const Sender: FC<SenderProps> = (props) => {
  const [inputType, setInputType] = useState("text");
  if (inputType === "text")
    return <TextSender textAreaClassName="pks_text-lg pks_p-3" {...props} />;
  return <AudioSender {...props} />;
};
