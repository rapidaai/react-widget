import {
  AssistantMessagingRequest,
  RAGStage,
  AssistantMessagingResponse,
  AssistantDefinition,
  GetAllConversationMessageResponse,
  GetAllConversationMessageRequest,
  GetAllAssistantConversationResponse,
  GetAllAssistantConversationRequest,
} from "@/app/clients/protos/talk-api_pb";
import * as grpcWeb from "grpc-web";
import { TalkServiceClient } from "@/app/clients/protos/Talk-apiServiceClientPb";
import {
  Criteria,
  Paginate,
  Message,
  Source,
  ResourceIdentifier,
  Owner,
} from "@/app/clients/protos/common_pb";
import {
  assistantApiUrl,
  HEADER_API_KEY,
  HEADER_SOURCE_KEY,
  HEADER_ENVIRONMENT_KEY,
  HEADER_REGION_KEY,
} from "@/app/configs/constant";

const ConversationClient = new TalkServiceClient(assistantApiUrl);

/**
 *
 * @param assistantId
 * @param assistantProviderModelId
 * @param message
 * @param authHeader
 * @param cb
 */
export function CreateAssistantMessage(
  assistant: {
    assistantId: string;
    assistantProviderModelId: string;
  },
  Conversation: {
    message: Message;
    assistantConversationId?: string | null;
  },

  identifier: {
    identifier: string;
    source: Source;
    owner: Owner;
  },
  //
  authHeader: {
    [HEADER_API_KEY]: string;
  }
): grpcWeb.ClientReadableStream<AssistantMessagingResponse> {
  const req = new AssistantMessagingRequest();
  const _assistant = new AssistantDefinition();
  _assistant.setAssistantid(assistant.assistantId);
  _assistant.setVersion(assistant.assistantProviderModelId);

  req.setAssistant(_assistant);
  if (Conversation.assistantConversationId) {
    req.setAssistantconversationid(Conversation.assistantConversationId);
  }
  req.setMessage(Conversation.message);
  req.setSource(identifier.source);

  let _ri = new ResourceIdentifier();
  _ri.setSource(identifier.source);
  _ri.setIdentifier(identifier.identifier);
  _ri.setOwner(identifier.owner);

  req.setSource(identifier.source);
  req.setIdentifier(_ri);
  return ConversationClient.assistantMessaging(req, {
    ...authHeader,
    [HEADER_SOURCE_KEY]: Source.WEB_PLUGIN.toString(),
    [HEADER_ENVIRONMENT_KEY]: "production",
    [HEADER_REGION_KEY]: "all",
  });
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
  assistant: { assistantId: string },
  assistantConversationId: string,
  query: {
    page: number;
    pageSize: number;
    criteria: { key: string; value: string }[];
  },
  identifier: {
    identifier: string;
    source: Source;
    owner: Owner;
  },
  authHeader: {
    [HEADER_API_KEY]: string;
  },
  cb: (
    err: grpcWeb.RpcError | null,
    uvcr: GetAllConversationMessageResponse | null
  ) => void
) {
  const req = new GetAllConversationMessageRequest();
  req.setAssistantid(assistant.assistantId);
  req.setAssistantconversationid(assistantConversationId);
  const paginate = new Paginate();
  query.criteria.forEach((x) => {
    let ctr = new Criteria();
    ctr.setKey(x.key);
    ctr.setValue(x.value);
    req.addCriterias(ctr);
  });
  paginate.setPage(query.page);
  paginate.setPagesize(query.pageSize);
  req.setPaginate(paginate);

  //
  let _ri = new ResourceIdentifier();
  _ri.setSource(identifier.source);
  _ri.setIdentifier(identifier.identifier);
  _ri.setOwner(identifier.owner);

  req.setSource(identifier.source);
  req.setIdentifier(_ri);
  ConversationClient.getAllConversationMessage(
    req,
    {
      ...authHeader,
      [HEADER_SOURCE_KEY]: Source.WEB_PLUGIN.toString(),
      [HEADER_ENVIRONMENT_KEY]: "production",
      [HEADER_REGION_KEY]: "all",
    },
    cb
  );
}

/**
 *
 * @param stage
 * @returns
 */
export function GetStageMessage(stage: RAGStage) {
  switch (stage) {
    case RAGStage.UNDEFINED_STAGE:
      return "is undefined. Please wait...";
    case RAGStage.QUERY_FORMULATION:
      return `is formulating the query...`;
    case RAGStage.INFORMATION_RETRIEVAL:
      return `is retrieving information...`;
    case RAGStage.DOCUMENT_RETRIEVAL:
      return `is retrieving documents...`;
    case RAGStage.CONTEXT_AUGMENTATION:
      return `is augmenting the context...`;
    case RAGStage.TEXT_GENERATION:
      return `is generating the text...`;
    case RAGStage.OUTPUT_EVALUATION:
      return `is evaluating the output...`;
    default:
      return "Unknown stage. Please wait...";
  }
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
  query: {
    page: number;
    pageSize: number;
    criteria: { key: string; value: string }[];
  },
  identifier: {
    identifier: string;
    source: Source;
    owner: Owner;
  },
  authHeader: {
    [HEADER_API_KEY]: string;
  },
  cb: (
    err: grpcWeb.RpcError | null,
    uvcr: GetAllAssistantConversationResponse | null
  ) => void
) {
  const req = new GetAllAssistantConversationRequest();
  req.setAssistantid(assistantId);
  const paginate = new Paginate();
  query.criteria.forEach((x) => {
    let ctr = new Criteria();
    ctr.setKey(x.key);
    ctr.setValue(x.value);
    req.addCriterias(ctr);
  });
  paginate.setPage(query.page);
  paginate.setPagesize(query.pageSize);
  req.setPaginate(paginate);

  //
  let _ri = new ResourceIdentifier();
  _ri.setSource(identifier.source);
  _ri.setIdentifier(identifier.identifier);
  _ri.setOwner(identifier.owner);

  req.setSource(identifier.source);
  req.setIdentifier(_ri);

  ConversationClient.getAllAssistantConversation(
    req,
    {
      ...authHeader,
      [HEADER_SOURCE_KEY]: Source.WEB_PLUGIN.toString(),
      [HEADER_ENVIRONMENT_KEY]: "production",
      [HEADER_REGION_KEY]: "all",
    },
    cb
  );
}
