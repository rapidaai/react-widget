/*
 *  Copyright (c) 2024. Rapida
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *  Author: Prashant <prashant@rapida.ai>
 *
 *  This module provides functions for managing projects through the ProjectService.
 */
import {
  AssistantMessagingRequest,
  GetAllConversationMessageRequest,
  GetAllConversationMessageResponse,
  GetAllAssistantConversationResponse,
  GetAllAssistantConversationRequest,
  AssistantDefinition,
  AssistantMessagingResponse,
} from "@/app/clients/protos/talk-api_pb";
// import { ClientAuthInfo, WithAuthContext } from "@/utils/index";
import { ServiceError } from "@/app/clients/protos/web-api_pb_service";
import { Criteria, Paginate, Message } from "@/app/clients/protos/common_pb";
import { ASSISTANT_API } from "@/configs";
import { TalkServiceClient } from "@/app/clients/protos/talk-api_pb_service";
import {
  BidirectionalStream,
  ResponseStream,
} from "@/app/clients/protos/endpoint-api_pb_service";
import { grpc } from "@improbable-eng/grpc-web";
import {
  fromStageStr,
  UndefinedStage,
  AuthenticationStage,
  TranscriptionStage,
  AssistantIdentificationStage,
  QueryFormulationStage,
  InformationRetrievalStage,
  DocumentRetrievalStage,
  ContextAugmentationStage,
  TextGenerationStage,
  OutputEvaluationStage,
} from "@/utils/rapida_stages";
import { ClientAuthInfo, UserAuthInfo, WithAuthContext } from "@/app/clients";

const conversationClient = new TalkServiceClient(ASSISTANT_API);
const conversationStreamClient = new TalkServiceClient(ASSISTANT_API, {
  transport: grpc.WebsocketTransport(),
  debug: true,
});

/**
 *
 * @param stage
 * @returns
 */
export function GetStageMessage(stage: string): string {
  switch (fromStageStr(stage)) {
    case UndefinedStage:
      return "is undefined. Please wait...";
    case AuthenticationStage:
      return "is authenticating...";
    case TranscriptionStage:
      return "is transcribing the audio...";
    case AssistantIdentificationStage:
      return "is identifying the assistant...";
    case QueryFormulationStage:
      return "is formulating the query...";
    case InformationRetrievalStage:
      return "is retrieving information...";
    case DocumentRetrievalStage:
      return "is retrieving documents...";
    case ContextAugmentationStage:
      return "is augmenting the context...";
    case TextGenerationStage:
      return "is generating the text...";
    case OutputEvaluationStage:
      return "is evaluating the output...";
    default:
      return "Unknown stage. Please wait...";
  }
}

/**
 *
 * @param assistantId
 * @param assistantProviderModelId
 * @param message
 * @param authHeader
 * @param cb
 */
export function AssistantMessaging(
  assistantDefinition: {
    assistantId: string;
    assistantProviderModelId: string | null;
  },
  conversation: {
    message: Message;
    assistantConversationId?: string | null;
  },
  authHeader: ClientAuthInfo | UserAuthInfo
): ResponseStream<AssistantMessagingResponse> {
  const req = new AssistantMessagingRequest();
  const ad = new AssistantDefinition();
  ad.setAssistantid(assistantDefinition.assistantId);
  if (assistantDefinition.assistantProviderModelId)
    ad.setVersion(assistantDefinition.assistantProviderModelId);
  req.setAssistant(ad);

  if (conversation.assistantConversationId) {
    req.setAssistantconversationid(conversation.assistantConversationId);
  }
  req.setMessage(conversation.message);
  return conversationClient.assistantMessaging(
    req,
    WithAuthContext(authHeader)
  );
}
/**
 *
 * @param assistantId
 * @param page
 * @param pageSize
 * @param criteria
 * @param cb
 * @param authHeader
 */
export function GetAllAssistantConversation(
  assistantId: string,
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  cb: (
    err: ServiceError | null,
    uvcr: GetAllAssistantConversationResponse | null
  ) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
) {
  const req = new GetAllAssistantConversationRequest();
  req.setAssistantid(assistantId);
  const paginate = new Paginate();
  criteria.forEach((x) => {
    let ctr = new Criteria();
    ctr.setKey(x.key);
    ctr.setValue(x.value);
    req.addCriterias(ctr);
  });
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  req.setPaginate(paginate);
  conversationClient.getAllAssistantConversation(
    req,
    WithAuthContext(authHeader),
    cb
  );
}

/**
 *
 * @param assistantId
 * @param assistantConversationId
 * @param page
 * @param pageSize
 * @param criteria
 * @param cb
 * @param authHeader
 */
export function GetAllAssistantConversationMessage(
  assistantId: string,
  assistantConversationId: string,
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  authHeader: ClientAuthInfo | UserAuthInfo,
  cb: (
    err: ServiceError | null,
    uvcr: GetAllConversationMessageResponse | null
  ) => void
) {
  const req = new GetAllConversationMessageRequest();
  req.setAssistantid(assistantId);
  req.setAssistantconversationid(assistantConversationId);
  const paginate = new Paginate();
  criteria.forEach((x) => {
    let ctr = new Criteria();
    ctr.setKey(x.key);
    ctr.setValue(x.value);
    req.addCriterias(ctr);
  });
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  req.setPaginate(paginate);
  conversationClient.getAllConversationMessage(
    req,
    WithAuthContext(authHeader),
    cb
  );
}

export function AssistantTalk(
  authHeader: ClientAuthInfo | UserAuthInfo
): BidirectionalStream<AssistantMessagingRequest, AssistantMessagingResponse> {
  return conversationStreamClient.assistantTalk(WithAuthContext(authHeader));
}
