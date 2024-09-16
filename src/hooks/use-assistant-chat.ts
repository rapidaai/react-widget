import {
  AssistantMessaging,
  GetAllAssistantConversationMessage,
} from "@/app/clients/talk";
import {
  AssistantMessagingResponse,
  GetAllConversationMessageResponse,
} from "@/app/clients/protos/talk-api_pb";
import {
  AssistantConversationMessage,
  Message,
} from "@/app/clients/protos/common_pb";

import {
  AssistantChatProperty,
  AssistantChatType,
} from "@/types/types.assistant-chat";
import { initialPaginated } from "@/types/types.paginated";
import React from "react";
import { create } from "zustand";
import { ServiceError } from "@/app/clients/protos/web-api_pb_service";
import { ResponseStream } from "@/app/clients/protos/endpoint-api_pb_service";
import { ClientAuthInfo, UserAuthInfo } from "@/app/clients";

const initialState: AssistantChatProperty = {
  conversations: [],
};

const initialChatActionState = {
  /**
   *
   * @param message
   * @returns
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => {},
};

const initialChatApiCallState = {
  onSend: function (
    assistantDefinition: {
      assistantId: string;
      assistantProviderModelId: string;
    },
    currentAssistantConversationId: string | null,
    message: Message,
    auth: UserAuthInfo | ClientAuthInfo
  ): ResponseStream<AssistantMessagingResponse> {
    throw new Error("Function not implemented.");
  },

  onGetConversationMessages: function (
    assistantId: string,
    conversationId: string,
    auth: UserAuthInfo | ClientAuthInfo,
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
export const useAssistantChat = create<AssistantChatType>((set, get) => ({
  ...initialState,
  ...initialPaginated,
  ...initialChatActionState,
  ...initialChatApiCallState,

  /**
   *
   * @param message
   */
  onChangeConversationMessages: (
    message: Array<AssistantConversationMessage>
  ) => {
    set({
      conversations: message,
    });
  },

  /**
   *
   * @param assistantId
   * @param conversationId
   * @param projectId
   * @param token
   * @param userId
   * @param onError
   * @param onSuccess
   */
  onGetConversationMessages: (
    assistantId: string,
    conversationId: string,
    auth: UserAuthInfo | ClientAuthInfo,
    onError: (err: string) => void,
    onSuccess: (e: AssistantConversationMessage[]) => void
  ) => {
    const afterGetAllAssistantConversationMessage = (
      err: ServiceError | null,
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
      assistantId,
      conversationId,
      get().page,
      get().pageSize,
      get().criteria,
      auth,
      afterGetAllAssistantConversationMessage
    );
  },

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
  ): ResponseStream<AssistantMessagingResponse> => {
    return AssistantMessaging(
      assistantDefinition,
      {
        message: message,
        assistantConversationId: currentAssistantConversationId,
      },
      auth
    );
  },

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

  /**
   *
   * @param k
   * @param v
   */
  addCriteria: (k: string, v: string, logic: string) => {
    get().criteria.push({ key: k, value: v, logic: logic });
  },

  /**
   * columns
   */
  columns: [],

  visibleColumn: (str) => {
    return true;
  },

  /**
   *
   * @param cl
   */
  setColumns(cl: { name: string; key: string; visible: boolean }[]) {
    set({
      columns: cl,
    });
  },

  /**
   * clear everything from the context
   * @returns
   */
  clear: () => {
    // set({ ...initialState }, false)
  },
}));
