import type {
  AssistantConversation,
  AssistantConversationMessage,
} from "@rapidaai/react";
import {
  MessageInputType,
  MessageResponseTypes,
} from "@carbon/ai-chat";
import type { HistoryItem } from "@carbon/ai-chat";

export interface ConversationHistoryEntry {
  id: string;
  title: string;
  date?: string;
}

export interface ConversationCriteria {
  key: string;
  value: string;
  logic: string;
}

function getMessageDate(message: AssistantConversationMessage): Date {
  return message.getCreateddate()?.toDate() ?? new Date(0);
}

function formatDate(date?: Date): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildConversationCriteria(
  userId: string,
  query = "",
): ConversationCriteria[] {
  const criteria: ConversationCriteria[] = [
    { key: "user_id", value: userId, logic: "eq" },
  ];
  const normalizedQuery = query.trim();
  if (normalizedQuery) {
    criteria.push({ key: "name", value: normalizedQuery, logic: "contains" });
  }
  return criteria;
}

export function toConversationHistoryEntry(
  conversation: AssistantConversation,
): ConversationHistoryEntry {
  const firstUserMessage = conversation
    .getAssistantconversationmessageList()
    .find((message) => message.getRole().toLocaleLowerCase() === "user");
  const title =
    conversation.getName().trim() ||
    firstUserMessage?.getBody().trim() ||
    `Conversation ${conversation.getId()}`;
  const date =
    conversation.getUpdateddate()?.toDate() ??
    conversation.getCreateddate()?.toDate();

  return {
    id: conversation.getId(),
    title,
    date: formatDate(date),
  };
}

export function toCarbonHistoryItems(
  messages: AssistantConversationMessage[],
): HistoryItem[] {
  return [...messages]
    .sort(
      (left, right) =>
        getMessageDate(left).getTime() - getMessageDate(right).getTime(),
    )
    .flatMap<HistoryItem>((message) => {
      const text = message.getBody().trim();
      if (!text) return [];

      const id = message.getMessageid() || message.getId();
      const role = message.getRole().toLocaleLowerCase();
      const time = getMessageDate(message).toISOString();

      if (role === "user") {
        return [{
          time,
          message: {
            id: `history:user:${id}`,
            input: { message_type: MessageInputType.TEXT, text },
            history: { label: text },
            thread_id: "main",
          },
        }];
      }

      if (role === "assistant") {
        return [{
          time,
          message: {
            id: `history:assistant:${id}`,
            output: {
              generic: [{ response_type: MessageResponseTypes.TEXT, text }],
            },
            thread_id: "main",
          },
        }];
      }

      return [];
    });
}
