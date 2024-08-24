import {
  CreateAssistantMessage,
  GetAllAssistantConversactionMessage,
} from "@/app/clients/talk";
import { create } from "zustand";
import {
  AssistantConversactionMessage,
  CreateAssistantMessageResponse,
  GetAllConversactionMessageResponse,
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

const initialState: AssistantChatProperty = {
  /**
   * current assistant which will be targeted
   */
  currentAssistant: null,

  /**
   *
   */
  currentAssistantConversactionId: null,

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
  onChangeConversactionMessages: (
    message: Array<AssistantConversactionMessage>
  ) => {},

  /**
   *
   * @param assistantConversactionId
   * @returns
   */
  onChangeAssistantConversactionId: (assistantConversactionId: string) => {},
};

const initialChatApiCallState = {
  onSend: function (
    assistant: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversactionId: string | null,
    message: Message,
    //
    userId: string,
    token: string
  ): grpcWeb.ClientReadableStream<CreateAssistantMessageResponse> {
    throw new Error("Function not implemented.");
  },
  onGetConversactionMessages: function (
    assistantId: string,
    conversactionId: string,
    token: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversactionMessage[]) => void
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

  onChangeAssistantConversactionId: (assistantConversactionId: string) => {
    set({
      currentAssistantConversactionId: assistantConversactionId,
    });
  },

  /**
   *
   * @param message
   */
  onChangeConversactionMessages: (
    message: Array<AssistantConversactionMessage>
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
  onGetConversactionMessages: (
    assistantId: string,
    conversactionId: string,
    token: string,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversactionMessage[]) => void
  ) => {
    const afterGetAllAssistantConversactionMessage = (
      err: any | null,
      epmr: GetAllConversactionMessageResponse | null
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

    GetAllAssistantConversactionMessage(
      assistantId,
      conversactionId,
      get().page,
      get().pageSize,
      get().criteria,
      {
        "x-api-key": token,
      },
      afterGetAllAssistantConversactionMessage
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
    currentAssistantConversactionId: string | null,
    message: Message,
    //
    userId: string,
    token: string
  ): grpcWeb.ClientReadableStream<CreateAssistantMessageResponse> => {
    return CreateAssistantMessage(
      assistant,
      {
        message: message,
        assistantConversactionId: currentAssistantConversactionId,
      },
      {
        identifier: userId,
        source: Source.WEB_PLUGIN,
        owner: Owner.CLIENT,
      },
      {
        "x-api-key": token,
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
