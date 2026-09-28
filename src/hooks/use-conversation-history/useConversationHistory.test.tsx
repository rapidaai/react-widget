import { act, renderHook, waitFor } from "@testing-library/react";
import { useConversationHistory } from "./useConversationHistory";

const mockGetAllAssistantConversation = jest.fn();
const mockGetAllAssistantConversationMessage = jest.fn();

jest.mock("@rapidaai/react", () => ({
  GetAllAssistantConversation: (...args: unknown[]) =>
    mockGetAllAssistantConversation(...args),
  GetAllAssistantConversationMessage: (...args: unknown[]) =>
    mockGetAllAssistantConversationMessage(...args),
}));

const timestamp = (value: string) => ({ toDate: () => new Date(value) });

const conversation = (id: string, name: string) => ({
  getId: () => id,
  getName: () => name,
  getAssistantconversationmessageList: () => [],
  getUpdateddate: () => timestamp("2026-09-28T10:00:00.000Z"),
  getCreateddate: () => undefined,
});

const historyMessage = (id: string, role: string, body: string) => ({
  getId: () => id,
  getMessageid: () => id,
  getRole: () => role,
  getBody: () => body,
  getCreateddate: () => timestamp("2026-09-28T10:00:00.000Z"),
});

const listResponse = (data: unknown[], total = data.length) => ({
  getSuccess: () => true,
  getDataList: () => data,
  getPaginated: () => ({ getTotalitem: () => total }),
});

describe("useConversationHistory", () => {
  const connectionConfig = { auth: { "x-api-key": "token" } } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and paginates conversations from the SDK", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const page = args[2] as number;
        const callback = args[5] as Function;
        callback(null, listResponse([
          conversation(String(page), `Conversation ${page}`),
        ], 2));
      },
    );

    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
      pageSize: 1,
    }));

    await waitFor(() => expect(result.current.entries).toHaveLength(1));
    expect(mockGetAllAssistantConversation.mock.calls[0][4]).toEqual([
      { key: "user_id", value: "user-1", logic: "eq" },
    ]);
    expect(result.current.hasMore).toBe(true);

    await act(async () => result.current.loadMore());

    expect(result.current.entries.map(({ id }) => id)).toEqual(["1", "2"]);
    expect(result.current.hasMore).toBe(false);
  });

  it("sends the search query to the server", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([]));
      },
    );
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));
    await waitFor(() => expect(mockGetAllAssistantConversation).toHaveBeenCalledTimes(1));

    act(() => result.current.search(" billing "));

    await waitFor(() => expect(mockGetAllAssistantConversation).toHaveBeenCalledTimes(2));
    expect(mockGetAllAssistantConversation.mock.calls[1][4]).toEqual([
      { key: "user_id", value: "user-1", logic: "eq" },
      { key: "name", value: "billing", logic: "contains" },
    ]);
  });

  it("fetches a conversation's messages and maps them to Carbon history", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([]));
      },
    );
    mockGetAllAssistantConversationMessage.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[7] as Function;
        callback(null, listResponse([
          historyMessage("message-1", "user", "Hello"),
          historyMessage("message-2", "assistant", "Hi"),
        ]));
      },
    );
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));

    let history: Awaited<ReturnType<typeof result.current.loadConversation>> = [];
    await act(async () => {
      history = await result.current.loadConversation("conversation-1");
    });

    expect(mockGetAllAssistantConversationMessage).toHaveBeenCalledWith(
      connectionConfig,
      "assistant-1",
      "conversation-1",
      1,
      100,
      [],
      connectionConfig.auth,
      expect.any(Function),
    );
    expect(history).toHaveLength(2);
    expect(result.current.restoringConversationId).toBeNull();
  });

  it("stays empty when history configuration is incomplete", async () => {
    const { result } = renderHook(() => useConversationHistory({
      userId: "user-1",
    }));

    await act(async () => Promise.resolve());

    expect(result.current.entries).toEqual([]);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGetAllAssistantConversation).not.toHaveBeenCalled();
    await expect(result.current.loadConversation("conversation-1")).rejects.toThrow(
      "Conversation history is unavailable.",
    );
  });

  it("surfaces list authentication and SDK errors", async () => {
    const noAuthConfig = {} as any;
    const { result, rerender } = renderHook(
      ({ config }) => useConversationHistory({
        connectionConfig: config,
        assistantId: "assistant-1",
        userId: "user-1",
      }),
      { initialProps: { config: noAuthConfig } },
    );

    await waitFor(() => expect(result.current.error).toBe(
      "Conversation history authentication is unavailable.",
    ));

    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback({ message: "History service unavailable" }, null);
      },
    );
    rerender({ config: connectionConfig });
    await waitFor(() => expect(result.current.error).toBe(
      "History service unavailable",
    ));
    expect(result.current.entries).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  it("handles unsuccessful list responses and can refresh", async () => {
    mockGetAllAssistantConversation
      .mockImplementationOnce((...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, { getSuccess: () => false });
      })
      .mockImplementation((...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([conversation("1", "Recovered")]));
      });
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));

    await waitFor(() => expect(result.current.error).toBe(
      "Unable to load conversation history.",
    ));
    await act(async () => result.current.refresh());
    expect(result.current.entries[0]?.title).toBe("Recovered");
    expect(result.current.error).toBeNull();
  });

  it("keeps existing entries when loading another page fails", async () => {
    mockGetAllAssistantConversation
      .mockImplementationOnce((...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([conversation("1", "First")], 2));
      })
      .mockImplementationOnce((...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(new Error("Next page failed"), null);
      });
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
      pageSize: 1,
    }));

    await waitFor(() => expect(result.current.hasMore).toBe(true));
    await act(async () => result.current.loadMore());

    expect(result.current.entries.map(({ id }) => id)).toEqual(["1"]);
    expect(result.current.error).toBe("Next page failed");
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("does not request another page when there is no next page", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([]));
      },
    );
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));
    await waitFor(() => expect(mockGetAllAssistantConversation).toHaveBeenCalledTimes(1));

    await act(async () => result.current.loadMore());
    expect(mockGetAllAssistantConversation).toHaveBeenCalledTimes(1);
  });

  it("loads every message page for long conversations", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([]));
      },
    );
    mockGetAllAssistantConversationMessage.mockImplementation(
      (...args: unknown[]) => {
        const page = args[3] as number;
        const callback = args[7] as Function;
        const messages = page === 1
          ? Array.from({ length: 100 }, (_, index) => historyMessage(
            `message-${index}`,
            "user",
            `Message ${index}`,
          ))
          : [historyMessage("message-100", "assistant", "Complete")];
        callback(null, listResponse(messages, 101));
      },
    );
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));

    let history: Awaited<ReturnType<typeof result.current.loadConversation>> = [];
    await act(async () => {
      history = await result.current.loadConversation("conversation-1");
    });

    expect(mockGetAllAssistantConversationMessage).toHaveBeenCalledTimes(2);
    expect(history).toHaveLength(101);
  });

  it("surfaces message authentication and response failures", async () => {
    mockGetAllAssistantConversation.mockImplementation(
      (...args: unknown[]) => {
        const callback = args[5] as Function;
        callback(null, listResponse([]));
      },
    );
    const { result: noAuthResult } = renderHook(() => useConversationHistory({
      connectionConfig: {} as any,
      assistantId: "assistant-1",
      userId: "user-1",
    }));
    await expect(noAuthResult.current.loadConversation("conversation-1")).rejects.toThrow(
      "Conversation history authentication is unavailable.",
    );
    await waitFor(() => expect(noAuthResult.current.error).toBe(
      "Conversation history authentication is unavailable.",
    ));

    mockGetAllAssistantConversationMessage.mockImplementationOnce(
      (...args: unknown[]) => {
        const callback = args[7] as Function;
        callback(null, { getSuccess: () => false });
      },
    );
    const { result } = renderHook(() => useConversationHistory({
      connectionConfig,
      assistantId: "assistant-1",
      userId: "user-1",
    }));
    await waitFor(() => expect(mockGetAllAssistantConversation).toHaveBeenCalled());
    await expect(result.current.loadConversation("conversation-2")).rejects.toThrow(
      "Unable to load conversation messages.",
    );
    await waitFor(() => expect(result.current.error).toBe(
      "Unable to load conversation messages.",
    ));
    expect(result.current.restoringConversationId).toBeNull();
  });
});
