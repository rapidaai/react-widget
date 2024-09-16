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
 *  Utility functions for working with gRPC metadata in Rapida applications.
 */

import { GetEnvironment, GetSource } from "@/utils";
import {
  HEADER_ENVIRONMENT_KEY,
  HEADER_SOURCE_KEY,
  HEADER_REGION_KEY,
  HEADER_API_KEY,
  HEADER_AUTH_ID,
  HEADER_PROJECT_ID,
} from "@/utils/rapida_header";
import { grpc } from "@improbable-eng/grpc-web";
import { ALL_REGION } from "@/utils/rapida_region";

/**
 * Configures gRPC metadata with platform-specific and environment-specific headers.
 *
 * @param il - The gRPC metadata to configure.
 * @returns The configured gRPC metadata.
 */
export const WithPlatform = (il: grpc.Metadata): grpc.Metadata => {
  // Set the source header based on the platform
  il.set(HEADER_SOURCE_KEY, GetSource());

  // Set the environment header if in production

  il.set(HEADER_ENVIRONMENT_KEY, GetEnvironment());

  // Set the region header to 'all' by default
  il.set(HEADER_REGION_KEY, ALL_REGION);

  return il;
};

/**
 * Configures gRPC metadata with authentication context headers.
 *
 * @param authHeader - A record of authentication headers to add.
 * @returns The configured gRPC metadata with authentication headers.
 */
export const WithAuthContext = (
  authHeader?: ClientAuthInfo | UserAuthInfo
): grpc.Metadata => {
  const metadata = WithPlatform(new grpc.Metadata());

  // Set each authentication header in the metadata
  if (authHeader)
    for (const [key, value] of Object.entries(authHeader)) {
      metadata.set(key, value);
    }

  return metadata;
};

/**
 * an client information that will help to create an authentication token and header informatioan
 */
export interface UserAuthInfo {
  authorization: string;
  [HEADER_AUTH_ID]: string;
  [HEADER_PROJECT_ID]?: string;
}

export interface ClientAuthInfo {
  [HEADER_API_KEY]: string;
  [HEADER_AUTH_ID]?: string;
}
