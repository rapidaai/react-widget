import {
  GetAssistantRequest,
  GetAssistantResponse,
} from "@/app/clients/protos/assistant-api_pb";
import * as grpcWeb from "grpc-web";
import { AssistantServiceClient } from "@/app/clients/protos/Assistant-apiServiceClientPb";

const client = new AssistantServiceClient("http://assistant.rapida.local");

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
  authHeader: {}
) {
  const req = new GetAssistantRequest();
  req.setId(assistantId);
  if (assistantProviderModelId)
    req.setAssistantprovidermodelid(assistantProviderModelId);

  client.getAssistant(req, authHeader, cb);
}
