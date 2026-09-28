import {
  buildConversationCriteria,
  getFirstUserMessageText,
  sortConversationsNewestFirst,
  toCarbonHistoryItems,
  toConversationHistoryEntry,
} from "./conversation-history";

const timestamp = (value: string) => ({
  toDate: () => new Date(value),
});

const message = ({
  id,
  role,
  body,
  date,
}: {
  id: string;
  role: string;
  body: string;
  date: string;
}) => ({
  getId: () => id,
  getMessageid: () => id,
  getRole: () => role,
  getBody: () => body,
  getCreateddate: () => timestamp(date),
});

describe("conversation history adapters", () => {
  it("builds server-side user and search criteria", () => {
    expect(buildConversationCriteria("user-1", " billing ")).toEqual([
      { key: "user_id", value: "user-1", logic: "eq" },
      { key: "name", value: "billing", logic: "contains" },
    ]);
    expect(buildConversationCriteria("user-1", "  ")).toEqual([
      { key: "user_id", value: "user-1", logic: "eq" },
    ]);
  });

  it("maps an SDK conversation to a history entry", () => {
    const conversation = {
      getId: () => "42",
      getName: () => "Server generated title",
      getAssistantconversationmessageList: () => [
        message({
          id: "message-1",
          role: "user",
          body: "Billing question",
          date: "2026-01-01T10:00:00.000Z",
        }),
      ],
      getUpdateddate: () => timestamp("2026-01-01T10:01:00.000Z"),
      getCreateddate: () => undefined,
    } as any;

    expect(toConversationHistoryEntry(conversation)).toEqual({
      id: "42",
      title: "Billing question",
      date: expect.any(String),
    });
  });

  it("falls back to the conversation id and handles missing dates", () => {
    const conversation = {
      getId: () => "42",
      getName: () => "",
      getAssistantconversationmessageList: () => [],
      getUpdateddate: () => undefined,
      getCreateddate: () => undefined,
    } as any;

    expect(toConversationHistoryEntry(conversation)).toEqual({
      id: "42",
      title: "Untitled conversation",
      date: undefined,
    });
  });

  it("does not use server names or ids when no user message is available", () => {
    const conversation = {
      getId: () => "conversation-id",
      getName: () => "Server generated title",
      getAssistantconversationmessageList: () => [],
      getUpdateddate: () => undefined,
      getCreateddate: () => undefined,
    } as any;

    expect(toConversationHistoryEntry(conversation).title).toBe(
      "Untitled conversation",
    );
  });

  it("orders conversations by their most recent activity", () => {
    const buildConversation = (
      id: string,
      updatedDate?: string,
      createdDate?: string,
    ) => ({
      getId: () => id,
      getUpdateddate: () => updatedDate ? timestamp(updatedDate) : undefined,
      getCreateddate: () => createdDate ? timestamp(createdDate) : undefined,
    });

    const ordered = sortConversationsNewestFirst([
      buildConversation("old", "2026-01-01T10:00:00.000Z"),
      buildConversation("new", "2026-09-28T10:00:00.000Z"),
      buildConversation("middle", undefined, "2026-05-01T10:00:00.000Z"),
    ] as any);

    expect(ordered.map((conversation) => conversation.getId())).toEqual([
      "new",
      "middle",
      "old",
    ]);
  });

  it("maps and orders SDK messages as Carbon history", () => {
    const history = toCarbonHistoryItems([
      message({
        id: "assistant-1",
        role: "assistant",
        body: "How can I help?",
        date: "2026-01-01T10:01:00.000Z",
      }),
      message({
        id: "user-1",
        role: "user",
        body: "Hello",
        date: "2026-01-01T10:00:00.000Z",
      }),
      message({
        id: "system-1",
        role: "system",
        body: "Ignored",
        date: "2026-01-01T10:02:00.000Z",
      }),
    ] as any);

    expect(history).toHaveLength(2);
    expect(history[0]).toMatchObject({
      time: "2026-01-01T10:00:00.000Z",
      message: { id: "history:user:user-1", input: { text: "Hello" } },
    });
    expect(history[1]).toMatchObject({
      time: "2026-01-01T10:01:00.000Z",
      message: {
        id: "history:assistant:assistant-1",
        output: { generic: [{ text: "How can I help?" }] },
      },
    });
  });

  it("selects the earliest non-empty user message for a title", () => {
    expect(getFirstUserMessageText([
      message({
        id: "assistant-1",
        role: "assistant",
        body: "Welcome",
        date: "2026-01-01T09:00:00.000Z",
      }),
      message({
        id: "user-2",
        role: "user",
        body: "Second question",
        date: "2026-01-01T11:00:00.000Z",
      }),
      message({
        id: "user-empty",
        role: "user",
        body: " ",
        date: "2026-01-01T08:00:00.000Z",
      }),
      message({
        id: "user-1",
        role: "user",
        body: "First question",
        date: "2026-01-01T10:00:00.000Z",
      }),
    ] as any)).toBe("First question");
  });

  it("ignores blank messages and supports SDK fallback ids and dates", () => {
    const fallbackMessage = {
      getId: () => "fallback-id",
      getMessageid: () => "",
      getRole: () => "user",
      getBody: () => "Fallback",
      getCreateddate: () => undefined,
    };
    const blankMessage = {
      ...fallbackMessage,
      getId: () => "blank",
      getBody: () => "   ",
    };

    expect(toCarbonHistoryItems([blankMessage, fallbackMessage] as any)).toEqual([
      expect.objectContaining({
        time: "1970-01-01T00:00:00.000Z",
        message: expect.objectContaining({ id: "history:user:fallback-id" }),
      }),
    ]);
  });
});
