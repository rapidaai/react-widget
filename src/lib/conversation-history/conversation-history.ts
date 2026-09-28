import { Message, MessageRole } from "@rapidaai/react";

export interface ConversationHistoryEntry {
  id: string;
  title: string;
  date?: string;
}

export function getConversationHistoryEntries(
  messages: Message[],
): ConversationHistoryEntry[] {
  const firstUserMessage = messages.find(
    (message) =>
      message.role === MessageRole.User &&
      message.messages.join(" ").trim().length > 0,
  );
  if (!firstUserMessage) return [];

  const latestDatedMessage = [...messages]
    .reverse()
    .find((message) => message.time);
  return [{
    id: `conversation:${firstUserMessage.id}`,
    title: firstUserMessage.messages.join(" ").trim(),
    date: latestDatedMessage?.time
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(latestDatedMessage.time))
      : undefined,
  }];
}
