import { MessageRole } from "@rapidaai/react";
import { getConversationHistoryEntries } from "./conversation-history";

describe("getConversationHistoryEntries", () => {
  it("creates one conversation entry using its first user prompt", () => {
    const entries = getConversationHistoryEntries([
      {
        id: "user-1",
        role: MessageRole.User,
        messages: ["First", "question"],
        time: new Date("2026-01-01T10:00:00Z"),
      },
      {
        id: "assistant-1",
        role: MessageRole.System,
        messages: ["Answer"],
        time: new Date("2026-01-01T10:01:00Z"),
      },
      {
        id: "empty",
        role: MessageRole.User,
        messages: ["  "],
      },
      {
        id: "user-2",
        role: MessageRole.User,
        messages: ["Latest question"],
      },
    ] as any);

    expect(entries.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: "conversation:user-1", title: "First question" },
    ]);
    expect(entries[0].date).toBeTruthy();
  });

  it("does not create history for a conversation without a user prompt", () => {
    expect(getConversationHistoryEntries([])).toEqual([]);
  });

  it("omits the date when the conversation has no timestamps", () => {
    expect(getConversationHistoryEntries([{
      id: "user-1",
      role: MessageRole.User,
      messages: ["Undated conversation"],
    }] as any)).toEqual([{
      id: "conversation:user-1",
      title: "Undated conversation",
      date: undefined,
    }]);
  });
});
