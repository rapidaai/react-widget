import {
  CreateAssistantMessageRequest,
  GetAllConversactionMessageRequest,
  GetAllConversactionMessageResponse,
  RAGStage,
  CreateAssistantMessageResponse,
} from "@/app/clients/protos/talk-api_pb";
import * as grpcWeb from "grpc-web";
import { AssistantServiceClient } from "@/app/clients/protos/Assistant-apiServiceClientPb";
import { TalkServiceClient } from "@/app/clients/protos/Talk-apiServiceClientPb";
import { Criteria, Paginate, Message } from "@/app/clients/protos/common_pb";
import { assistantApiUrl } from "@/app/configs/constant";

const conversactionClient = new TalkServiceClient(assistantApiUrl);

/**
 *
 * @param assistantId
 * @param assistantProviderModelId
 * @param message
 * @param authHeader
 * @param cb
 */
export function CreateAssistantMessage(
  assistantId: string,
  assistantProviderModelId: string,
  conversaction: {
    message: Message;
    assistantConversactionId?: string | null;
  },
  authHeader: {
    "x-api-key": string;
  }
): grpcWeb.ClientReadableStream<CreateAssistantMessageResponse> {
  const req = new CreateAssistantMessageRequest();
  req.setAssistantid(assistantId);
  if (conversaction.assistantConversactionId) {
    req.setAssistantconversactionid(conversaction.assistantConversactionId);
  }
  req.setMessage(conversaction.message);
  req.setAssistantprovidermodelid(assistantProviderModelId);
  const metadata = { ...authHeader };
  return conversactionClient.createAssistantMessage(req, metadata);
}

/**
 *
 * @param assistantId
 * @param assistantConversactionId
 * @param page
 * @param pageSize
 * @param criteria
 * @param cb
 * @param authHeader
 */
export function GetAllAssistantConversactionMessage(
  assistantId: string,
  assistantConversactionId: string,
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  authHeader: {
    "x-api-key": string;
  },
  cb: (
    err: grpcWeb.RpcError | null,
    uvcr: GetAllConversactionMessageResponse | null
  ) => void
) {
  const req = new GetAllConversactionMessageRequest();
  req.setAssistantid(assistantId);
  req.setAssistantconversactionid(assistantConversactionId);
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
  conversactionClient.getAllConversactionMessage(req, authHeader, cb);
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
