import {
  AssistantConversactionMessage,
  CreateAssistantMessageResponse,
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
  currentAssistantConversactionId: string | null;

  /**
   *
   */
  conversactions: AssistantConversactionMessage[];
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
    assistantId: string,
    assistantProviderModelId: string,
    currentAssistantConversactionId: string | null,
    message: Message,
    token: string
  ) => grpcWeb.ClientReadableStream<CreateAssistantMessageResponse>;

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
  onGetConversactionMessages: (
    assistantId: string,
    conversactionId: string,
    token: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversactionMessage[]) => void
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
  onChangeConversactionMessages: (
    message: Array<AssistantConversactionMessage>
  ) => void;

  /**
   *
   * @param assistantConversactionId
   * @returns
   */
  onChangeAssistantConversactionId: (assistantConversactionId: string) => void;
} & PaginatedType &
  AssistantChatProperty &
  AssistantChatApiCallAction;
