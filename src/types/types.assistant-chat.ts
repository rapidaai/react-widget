import {
  AssistantConversationMessage,
  AssistantMessagingResponse,
} from "@/app/clients/protos/talk-api_pb";
import { PaginatedType } from "@/app/types/types.paginated";
import { Message } from "@/app/clients/protos/common_pb";
import * as grpcWeb from "grpc-web";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";

/**
 *
 */
export type AssistantChatProperty = {
  /**
   * current assistant
   */
  currentAssistant: Assistant | null;

  /**
   * assistant conversaction
   */
  currentAssistantConversationId: string | null;

  /**
   *
   */
  conversactions: AssistantConversationMessage[];
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
    assistant: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    //
    userId: string,
    token: string
  ) => grpcWeb.ClientReadableStream<AssistantMessagingResponse>;

  /**
   *
   * @param assistantId
   * @param conversactionId
   * @param projectId
   * @param token
   * @param userId
   * @param onError
   * @param onSuccess
   * @returns
   */
  onGetConversationMessages: (
    assistantId: string,
    conversactionId: string,
    userId: string,
    token: string,
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
   * @param assistant
   * @returns
   */
  onChangeCurrentAssistant: (assistant: Assistant) => void;

  /**
   *
   * @param message
   * @returns
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => void;

  /**
   *
   * @param assistantConversationId
   * @returns
   */
  onChangeAssistantConversationId: (assistantConversationId: string) => void;
} & PaginatedType &
  AssistantChatProperty &
  AssistantChatApiCallAction;
