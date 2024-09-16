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
 *  This module provides functions for managing assistants using gRPC. It includes
 *  operations for creating, updating, retrieving, and personalizing assistants,
 *  as well as handling assistant provider models and tags.
 */

import { Criteria, Ordering, Paginate } from "@/app/clients/protos/common_pb";
import {
  GetAllAssistantRequest,
  GetAllAssistantResponse,
  CreateAssistantRequest,
  GetAllAssistantProviderModelRequest,
  UpdateAssistantVersionRequest,
  UpdateAssistantVersionResponse,
  GetAssistantRequest,
  GetAssistantResponse,
  CreateAssistantTagRequest,
  CreateAssistantResponse,
  AssistantProviderModelAttribute,
  AssistantAttribute,
  CreateAssistantProviderModelRequest,
  CreateAssistantProviderModelResponse,
  GetAllAssistantProviderModelResponse,
  AssistantKnowledgeConfigurationAttribute,
  UpdateAssistantDetailRequest,
  CreateAssistantKnowledgeConfigurationRequest,
  PersonalizeAssistantRequest,
  GetAllAssistantMessageRequest,
  GetAllAssistantMessageResponse,
} from "@/app/clients/protos/assistant-api_pb";
import { ASSISTANT_API } from "@/configs";
import { AssistantServiceClient } from "@/app/clients/protos/assistant-api_pb_service";
import {
  ServiceError,
  UnaryResponse,
} from "@/app/clients/protos/web-api_pb_service";
import { ClientAuthInfo, UserAuthInfo, WithAuthContext } from "@/app/clients";

const client = new AssistantServiceClient(ASSISTANT_API);

/**
 * Retrieve all assistants with pagination and filtering criteria.
 *
 * @param page - The page number for pagination.
 * @param pageSize - The number of assistants per page.
 * @param criteria - List of criteria to filter assistants.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function GetAllAssistant(
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  cb: (
    err: ServiceError | null,
    response: GetAllAssistantResponse | null
  ) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new GetAllAssistantRequest();
  const paginate = new Paginate();

  criteria.forEach(({ key, value }) => {
    const ctr = new Criteria();
    ctr.setKey(key);
    ctr.setValue(value);
    req.addCriterias(ctr);
  });

  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  req.setPaginate(paginate);

  return client.getAllAssistant(req, WithAuthContext(authHeader), cb);
}

/**
 * Update the version of an assistant.
 *
 * @param assistantId - The ID of the assistant to update.
 * @param assistantProviderModelId - The ID of the assistant provider model.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function UpdateAssistantVersion(
  assistantId: string,
  assistantProviderModelId: string,
  cb: (
    err: ServiceError | null,
    response: UpdateAssistantVersionResponse | null
  ) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new UpdateAssistantVersionRequest();
  req.setAssistantid(assistantId);
  req.setAssistantprovidermodelid(assistantProviderModelId);

  return client.updateAssistantVersion(req, WithAuthContext(authHeader), cb);
}

/**
 * Retrieve all assistant provider models with pagination and filtering criteria.
 *
 * @param assistantId - The ID of the assistant.
 * @param page - The page number for pagination.
 * @param pageSize - The number of provider models per page.
 * @param criteria - List of criteria to filter provider models.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function GetAllAssistantProviderModel(
  assistantId: string,
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  cb: (
    err: ServiceError | null,
    response: GetAllAssistantProviderModelResponse | null
  ) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new GetAllAssistantProviderModelRequest();
  req.setAssistantid(assistantId);

  const paginate = new Paginate();
  criteria.forEach(({ key, value }) => {
    const ctr = new Criteria();
    ctr.setKey(key);
    ctr.setValue(value);
    req.addCriterias(ctr);
  });

  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  req.setPaginate(paginate);

  return client.getAllAssistantProviderModel(
    req,
    WithAuthContext(authHeader),
    cb
  );
}

/**
 * Retrieve details of a specific assistant.
 *
 * @param assistantId - The ID of the assistant to retrieve.
 * @param assistantProviderModelId - Optional ID of the assistant provider model.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function GetAssistant(
  assistantId: string,
  assistantProviderModelId: string | null,
  cb: (err: ServiceError | null, response: GetAssistantResponse | null) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new GetAssistantRequest();
  req.setId(assistantId);
  if (assistantProviderModelId) {
    req.setAssistantprovidermodelid(assistantProviderModelId);
  }

  return client.getAssistant(req, WithAuthContext(authHeader), cb);
}

/**
 * Create a new assistant provider model.
 *
 * @param assistantId - The ID of the assistant.
 * @param assistantProviderModel - Attributes for the new provider model.
 * @param authHeader - Authentication headers for the request.
 * @param cb - Callback function to handle the response.
 * @returns UnaryResponse - The gRPC response object.
 */
export function CreateAssistantProviderModel(
  assistantId: string,
  assistantProviderModel: AssistantProviderModelAttribute,
  authHeader: ClientAuthInfo | UserAuthInfo,
  cb: (
    err: ServiceError | null,
    response: CreateAssistantProviderModelResponse | null
  ) => void
): UnaryResponse {
  const req = new CreateAssistantProviderModelRequest();
  req.setAssistantid(assistantId);
  req.setAssistantprovidermodelattribute(assistantProviderModel);

  return client.createAssistantProviderModel(
    req,
    WithAuthContext(authHeader),
    cb
  );
}

/**
 * Create a new assistant with the specified attributes.
 *
 * @param assistantProviderModel - Attributes for the assistant provider model.
 * @param assistantAttributes - Attributes for the assistant.
 * @param assistantKnowledgeConfig - Knowledge configuration attributes for the assistant.
 * @param tags - Tags associated with the assistant.
 * @param authHeader - Authentication headers for the request.
 * @param cb - Callback function to handle the response.
 * @returns UnaryResponse - The gRPC response object.
 */
export function CreateAssistant(
  assistantProviderModel: AssistantProviderModelAttribute,
  assistantAttributes: AssistantAttribute,
  assistantKnowledgeConfig: Array<AssistantKnowledgeConfigurationAttribute>,
  tags: string[],
  authHeader: ClientAuthInfo | UserAuthInfo,
  cb: (
    err: ServiceError | null,
    response: CreateAssistantResponse | null
  ) => void
): UnaryResponse {
  const req = new CreateAssistantRequest();
  req.setAssistantattribute(assistantAttributes);
  req.setAssistantprovidermodelattribute(assistantProviderModel);
  req.setAssistantknowledgeconfigurationattributesList(
    assistantKnowledgeConfig
  );
  req.setTagsList(tags);

  return client.createAssistant(req, WithAuthContext(authHeader), cb);
}

/**
 * Create tags for an assistant.
 *
 * @param assistantId - The ID of the assistant.
 * @param tags - List of tags to add.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function CreateAssistantTag(
  assistantId: string,
  tags: string[],
  cb: (err: ServiceError | null, response: GetAssistantResponse | null) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new CreateAssistantTagRequest();
  req.setTagsList(tags);
  req.setAssistantid(assistantId);

  return client.createAssistantTag(req, WithAuthContext(authHeader), cb);
}

/**
 * Update details of an existing assistant.
 *
 * @param assistantId - The ID of the assistant to update.
 * @param name - The new name for the assistant.
 * @param description - The new description for the assistant.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function UpdateAssistantDetail(
  assistantId: string,
  name: string,
  description: string,
  cb: (err: ServiceError | null, response: GetAssistantResponse | null) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new UpdateAssistantDetailRequest();
  req.setName(name);
  req.setDescription(description);
  req.setAssistantid(assistantId);

  return client.updateAssistantDetail(req, WithAuthContext(authHeader), cb);
}

/**
 * Personalize an assistant with specific settings.
 *
 * @param assistantId - The ID of the assistant to personalize.
 * @param req - The request object containing personalization settings.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function PersonalizeAssistant(
  assistantId: string,
  req: PersonalizeAssistantRequest,
  cb: (err: ServiceError | null, response: GetAssistantResponse | null) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  req.setAssistantid(assistantId);

  return client.personalizeAssistant(req, WithAuthContext(authHeader), cb);
}

/**
 * Create a knowledge configuration for an assistant.
 *
 * @param assistantId - The ID of the assistant.
 * @param assistantKnowledgeConfig - Knowledge configuration attributes.
 * @param cb - Callback function to handle the response.
 * @param authHeader - Authentication headers for the request.
 * @returns UnaryResponse - The gRPC response object.
 */
export function CreateAssistantKnowledgeConfiguration(
  assistantId: string,
  assistantKnowledgeConfig: Array<AssistantKnowledgeConfigurationAttribute>,
  cb: (err: ServiceError | null, response: GetAssistantResponse | null) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new CreateAssistantKnowledgeConfigurationRequest();
  req.setAssistantknowledgeconfigurationattributesList(
    assistantKnowledgeConfig
  );
  req.setAssistantid(assistantId);
  return client.createAssistantKnowledgeConfiguration(
    req,
    WithAuthContext(authHeader),
    cb
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
 * @returns
 */
export function GetAssistantMessages(
  assistantId: string,
  page: number,
  pageSize: number,
  criteria: { key: string; value: string }[],
  cb: (
    err: ServiceError | null,
    response: GetAllAssistantMessageResponse | null
  ) => void,
  authHeader: ClientAuthInfo | UserAuthInfo
): UnaryResponse {
  const req = new GetAllAssistantMessageRequest();
  const paginate = new Paginate();

  criteria.forEach(({ key, value }) => {
    const ctr = new Criteria();
    ctr.setKey(key);
    ctr.setValue(value);
    req.addCriterias(ctr);
  });

  req.setAssistantid(assistantId);
  paginate.setPage(page);
  paginate.setPagesize(pageSize);
  const order = new Ordering();
  order.setColumn("created_date");
  order.setOrder("desc");
  req.setOrder(order);
  req.setPaginate(paginate);

  return client.getAllAssistantMessage(req, WithAuthContext(authHeader), cb);
}
