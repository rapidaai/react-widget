import { Message, MessageRole, MessageStatus } from "@rapidaai/react";
import {
  MessageInputType,
  MessageRequest,
  MessageResponseTypes,
  OptionItemPreference,
  StreamChunk,
} from "@carbon/ai-chat";

export interface RenderedAssistantMessage {
  carbonId: string;
  itemId: string;
  text: string;
  status: MessageStatus;
}

export type AssistantSyncPlan =
  | { kind: "none" }
  | {
      kind: "chunk";
      chunk: StreamChunk;
      rendered: RenderedAssistantMessage;
      settlesPendingResponse: boolean;
    };

export function getMessageKey(message: Pick<Message, "role" | "id">): string {
  return `${message.role}:${message.id}`;
}

export function getMessageText(message: Pick<Message, "messages">): string {
  return message.messages.join("\n");
}

export function createTranscriptRequest(text: string, id: string): MessageRequest {
  return {
    id,
    input: { message_type: MessageInputType.TEXT, text },
    history: { label: text },
    thread_id: "main",
  };
}

export function createWelcomeMessage(greeting?: string, suggestions: string[] = []) {
  const generic = [];

  if (greeting) {
    generic.push({ response_type: MessageResponseTypes.TEXT, text: greeting });
  }
  if (suggestions.length) {
    generic.push({
      response_type: MessageResponseTypes.OPTION,
      preference: OptionItemPreference.BUTTON,
      options: suggestions.map((label) => ({
        label,
        value: { input: { text: label } },
      })),
    });
  }

  return generic.length ? { id: "rapida-welcome", output: { generic } } : null;
}

export function planAssistantSync(
  message: Message,
  current?: RenderedAssistantMessage,
): AssistantSyncPlan {
  if (message.role === MessageRole.User) return { kind: "none" };

  const text = getMessageText(message);
  if (!text || (current?.text === text && current.status === message.status)) {
    return { kind: "none" };
  }

  const messageKey = getMessageKey(message);
  const carbonId = `rapida:${messageKey}`;
  const itemId = `${messageKey}:text`;
  const rendered = { carbonId, itemId, text, status: message.status };

  if (message.status === MessageStatus.Complete) {
    return {
      kind: "chunk",
      chunk: {
        final_response: {
          id: carbonId,
          output: {
            generic: [{
              response_type: MessageResponseTypes.TEXT,
              text,
              streaming_metadata: { id: itemId },
            }],
          },
        },
      },
      rendered,
      settlesPendingResponse: current?.status !== MessageStatus.Complete,
    };
  }

  const previousText = current?.text ?? "";
  if (!text.startsWith(previousText)) return { kind: "none" };
  const appendedText = text.slice(previousText.length);
  if (!appendedText) return { kind: "none" };

  return {
    kind: "chunk",
    chunk: {
      streaming_metadata: { response_id: carbonId },
      partial_item: {
        response_type: MessageResponseTypes.TEXT,
        text: appendedText,
        streaming_metadata: { id: itemId },
      },
    },
    rendered,
    settlesPendingResponse: false,
  };
}
