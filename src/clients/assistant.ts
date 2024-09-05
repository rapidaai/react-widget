import {
  GetAssistantRequest,
  GetAssistantResponse,
} from "@/app/clients/protos/assistant-api_pb";
import * as grpcWeb from "grpc-web";
import { AssistantServiceClient } from "@/app/clients/protos/Assistant-apiServiceClientPb";
import { assistantApiUrl } from "@/app/configs/constant";
import { Source } from "@/app/clients/protos/common_pb";
import {
  HEADER_API_KEY,
  HEADER_SOURCE_KEY,
  HEADER_ENVIRONMENT_KEY,
  HEADER_REGION_KEY,
} from "../configs/constant";

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
    [HEADER_API_KEY]: string;
  }
) {
  const req = new GetAssistantRequest();
  req.setId(assistantId);
  if (assistantProviderModelId)
    req.setAssistantprovidermodelid(assistantProviderModelId);
  client.getAssistant(
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
