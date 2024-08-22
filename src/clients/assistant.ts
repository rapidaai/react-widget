import {
  GetAssistantRequest,
  GetAssistantResponse,
} from "@/app/clients/protos/assistant-api_pb";
import * as grpcWeb from "grpc-web";
import { AssistantServiceClient } from "@/app/clients/protos/Assistant-apiServiceClientPb";
import { assistantApiUrl } from "@/app/configs/constant";

const client = new AssistantServiceClient(assistantApiUrl);

/**
 *
 * @param assistantId
 * @param projectId
 * @param cb
 * @param authHeader
 */
export function GetAssistant(
  assistantId: string,
  assistantProviderModelId: string | null,
  cb: (err: grpcWeb.RpcError | null, uvcr: GetAssistantResponse | null) => void,
  authHeader: {
    "x-api-key": string;
  }
) {
  const req = new GetAssistantRequest();
  req.setId(assistantId);
  if (assistantProviderModelId)
    req.setAssistantprovidermodelid(assistantProviderModelId);

  client.getAssistant(req, authHeader, cb);
}
