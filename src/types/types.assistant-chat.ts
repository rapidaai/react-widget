import { AssistantMessagingResponse } from "@/app/clients/protos/talk-api_pb";
import { ColumnarType } from "./types.columnar";
import { PaginatedType } from "./types.paginated";
import {
  AssistantConversationMessage,
  Message,
} from "@/app/clients/protos/common_pb";
import { ResponseStream } from "@/app/clients/protos/endpoint-api_pb_service";
import { ClientAuthInfo, UserAuthInfo } from "@/app/clients";

/**
 *
 */
export type AssistantChatProperty = {
  /**
   *
   */
  conversations: AssistantConversationMessage[];
};

/**
 * assistant context
 */
type AssistantChatApiCallAction = {
  /**
   *
   * @param assistant
   * @returns
   */
  onSend: (
    assistantDefinition: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    auth: UserAuthInfo | ClientAuthInfo
  ) => ResponseStream<AssistantMessagingResponse>;

  /**
   *
   * @param assistantId
   * @param conversationId
   * @param projectId
   * @param token
   * @param userId
   * @param onError
   * @param onSuccess
   * @returns
   */
  onGetConversationMessages: (
    assistantId: string,
    conversationId: string,
    auth: UserAuthInfo | ClientAuthInfo,
    // projectId: string,
    // token: string,
    // userId: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversationMessage[]) => void
  ) => void;

  /**
   * clear everything
   * @returns
   */
  clear: () => void;
};

export type AssistantChatType = {
  /**
   *
   * @param message
   * @returns
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => void;
} & PaginatedType &
  ColumnarType &
  AssistantChatProperty &
  AssistantChatApiCallAction;
