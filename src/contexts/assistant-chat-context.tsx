import {
  CreateAssistantMessage,
  GetAllAssistantConversationMessage,
} from "@/app/clients/talk";
import { create } from "zustand";
import {
  AssistantConversationMessage,
  AssistantMessagingResponse,
  GetAllConversationMessageResponse,
} from "@/app/clients/protos/talk-api_pb";
import { Message, Owner, Source } from "@/app/clients/protos/common_pb";

import {
  AssistantChatProperty,
  AssistantChatType,
} from "@/app/types/types.assistant-chat";
import { initialPaginated } from "@/app/types/types.paginated";
import React from "react";
import * as grpcWeb from "grpc-web";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { HEADER_API_KEY } from "@/app/configs/constant";

const initialState: AssistantChatProperty = {
  /**
   * current assistant which will be targeted
   */
  currentAssistant: null,

  /**
   *
   */
  currentAssistantConversationId: null,

  /**
   *
   */
  conversactions: [],
};

const initialChatActionState = {
  /**
   *
   * @param assistant
   * @returns
   */
  onChangeCurrentAssistant: (assistant: Assistant) => {},

  /**
   *
   * @param message
   * @returns
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => {},

  /**
   *
   * @param assistantConversationId
   * @returns
   */
  onChangeAssistantConversationId: (assistantConversationId: string) => {},
};

const initialChatApiCallState = {
  onSend: function (
    assistant: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    //
    userId: string,
    token: string
  ): grpcWeb.ClientReadableStream<AssistantMessagingResponse> {
    throw new Error("Function not implemented.");
  },
  onGetConversationMessages: function (
    assistantId: string,
    conversactionId: string,
    userId: string,
    token: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversationMessage[]) => void
  ): void {
    throw new Error("Function not implemented.");
  },
  clear: function (): void {
    throw new Error("Function not implemented.");
  },
};

export const AssistantChatContext = React.createContext<AssistantChatType>({
  ...initialState,
  ...initialPaginated,
  ...initialChatActionState,
  ...initialChatApiCallState,
});

/**
 *
 */
const useAssistantChat = create<AssistantChatType>((set, get) => ({
  ...initialState,
  ...initialPaginated,
  ...initialChatActionState,
  ...initialChatApiCallState,

  onChangeAssistantConversationId: (assistantConversationId: string) => {
    set({
      currentAssistantConversationId: assistantConversationId,
    });
  },

  /**
   *
   * @param message
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => {
    set({
      conversactions: message,
    });
  },
  /**
   *
   * @param assistantId
   * @param conversactionId
   * @param projectId
   * @param token
   * @param userId
   * @param onError
   * @param onSuccess
   */
  onGetConversationMessages: (
    assistantId: string,
    conversactionId: string,
    userId: string,
    token: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversationMessage[]) => void
  ) => {
    const afterGetAllAssistantConversationMessage = (
      err: any | null,
      epmr: GetAllConversationMessageResponse | null
    ) => {
      if (epmr?.getSuccess()) {
        let message = epmr.getDataList();
        if (message) {
          onSuccess(message);
        }
      } else {
        const errorMessage =
          "Unable to get your assistant. please try again later.";
        const error = epmr?.getError();
        if (error) {
          onError(error.getHumanmessage());
          return;
        }
        onError(errorMessage);
        return;
      }
    };

    GetAllAssistantConversationMessage(
      { assistantId: assistantId },
      conversactionId,
      {
        page: get().page,
        pageSize: get().pageSize,
        criteria: get().criteria,
      },
      {
        identifier: userId,
        source: Source.WEB_PLUGIN,
        owner: Owner.CLIENT,
      },
      {
        [HEADER_API_KEY]: token,
      },
      afterGetAllAssistantConversationMessage
    );
  },

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
  ): grpcWeb.ClientReadableStream<AssistantMessagingResponse> => {
    return CreateAssistantMessage(
      assistant,
      {
        message: message,
        assistantConversationId: currentAssistantConversationId,
      },
      {
        identifier: userId,
        source: Source.WEB_PLUGIN,
        owner: Owner.CLIENT,
      },
      {
        [HEADER_API_KEY]: token,
      }
    );
  },

  /**
   *
   * @returns
   */
  onGetMessages: () => {},
  /**
   *
   * @param number
   * @returns
   */
  setPageSize: (pageSize: number) => {
    // when someone change pagesize change the page to zero
    set({
      page: 1,
      pageSize: pageSize,
    });
  },

  /**
   *
   * @param number
   * @returns
   */
  setPage: (pg: number) => {
    set({
      page: pg,
    });
  },

  /**
   *
   * @param number
   * @returns
   */
  setTotalCount: (tc: number) => {
    set({
      totalCount: tc,
    });
  },

  onChangeCurrentAssistant: (assistant: Assistant) => {
    set({ currentAssistant: assistant, conversactions: [] });
  },

  /**
   *
   * @param k
   * @param v
   */
  addCriteria: (k: string, v: string, logic: string) => {
    get().criteria.push({ key: k, value: v, logic: logic });
  },

  /**
   * clear everything from the context
   * @returns
   */
  clear: () => set({ ...initialState }, false),
}));

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
