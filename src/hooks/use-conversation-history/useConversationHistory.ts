import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionConfig,
  GetAllAssistantConversation,
  GetAllAssistantConversationMessage,
} from "@rapidaai/react";
import type {
  AssistantConversation,
  AssistantConversationMessage,
  GetAllAssistantConversationResponse,
  GetAllConversationMessageResponse,
} from "@rapidaai/react";
import type { HistoryItem } from "@carbon/ai-chat";
import {
  buildConversationCriteria,
  ConversationHistoryEntry,
  sortConversationsNewestFirst,
  toCarbonHistoryItems,
  toConversationHistoryEntry,
} from "@/lib/conversation-history";

const DEFAULT_PAGE_SIZE = 20;
const MESSAGE_PAGE_SIZE = 100;
const SEARCH_DELAY_MS = 300;

export interface UseConversationHistoryOptions {
  connectionConfig?: ConnectionConfig;
  assistantId?: string;
  userId: string;
  pageSize?: number;
}

export interface ConversationHistoryState {
  entries: ConversationHistoryEntry[];
  query: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  restoringConversationId: string | null;
  hasMore: boolean;
  error: string | null;
  search: (query: string) => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<HistoryItem[]>;
}

interface ConversationPage {
  conversations: AssistantConversation[];
  total: number;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "Unable to load conversation history.";
}

function listConversations(
  connectionConfig: ConnectionConfig,
  assistantId: string,
  userId: string,
  page: number,
  pageSize: number,
  query: string,
): Promise<ConversationPage> {
  return new Promise((resolve, reject) => {
    const auth = connectionConfig.auth;
    if (!auth) {
      reject(new Error("Conversation history authentication is unavailable."));
      return;
    }

    GetAllAssistantConversation(
      connectionConfig,
      assistantId,
      page,
      pageSize,
      buildConversationCriteria(userId, query),
      (error, response: GetAllAssistantConversationResponse | null) => {
        if (error) {
          reject(error);
          return;
        }
        if (!response?.getSuccess()) {
          reject(new Error("Unable to load conversation history."));
          return;
        }

        resolve({
          conversations: response.getDataList(),
          total: response.getPaginated()?.getTotalitem() ?? 0,
        });
      },
      auth,
    );
  });
}

function listConversationMessages(
  connectionConfig: ConnectionConfig,
  assistantId: string,
  conversationId: string,
  page: number,
): Promise<{ messages: AssistantConversationMessage[]; total: number }> {
  return new Promise((resolve, reject) => {
    const auth = connectionConfig.auth;
    if (!auth) {
      reject(new Error("Conversation history authentication is unavailable."));
      return;
    }

    GetAllAssistantConversationMessage(
      connectionConfig,
      assistantId,
      conversationId,
      page,
      MESSAGE_PAGE_SIZE,
      [],
      auth,
      (error, response: GetAllConversationMessageResponse | null) => {
        if (error) {
          reject(error);
          return;
        }
        if (!response?.getSuccess()) {
          reject(new Error("Unable to load conversation messages."));
          return;
        }

        resolve({
          messages: response.getDataList(),
          total: response.getPaginated()?.getTotalitem() ?? 0,
        });
      },
    );
  });
}

export function useConversationHistory({
  connectionConfig,
  assistantId,
  userId,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseConversationHistoryOptions): ConversationHistoryState {
  const [entries, setEntries] = useState<ConversationHistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [restoringConversationId, setRestoringConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const conversationsById = useRef(new Map<string, AssistantConversation>());

  const fetchFirstPage = useCallback(async (searchQuery: string) => {
    if (!connectionConfig || !assistantId || !userId) {
      requestVersion.current += 1;
      conversationsById.current.clear();
      setEntries([]);
      setPage(0);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      return;
    }

    const requestId = ++requestVersion.current;
    setLoading(true);
    setLoadingMore(false);
    setError(null);
    try {
      const result = await listConversations(
        connectionConfig,
        assistantId,
        userId,
        1,
        pageSize,
        searchQuery,
      );
      if (requestId !== requestVersion.current) return;
      const sortedConversations = sortConversationsNewestFirst(
        result.conversations,
      );
      conversationsById.current = new Map(
        sortedConversations.map((conversation) => [
          conversation.getId(),
          conversation,
        ]),
      );
      const nextEntries = sortedConversations.map(toConversationHistoryEntry);
      setEntries(nextEntries);
      setPage(1);
      setHasMore(
        result.total > 0
          ? nextEntries.length < result.total
          : result.conversations.length === pageSize,
      );
    } catch (requestError) {
      if (requestId !== requestVersion.current) return;
      setEntries([]);
      conversationsById.current.clear();
      setPage(0);
      setHasMore(false);
      setError(getErrorMessage(requestError));
    } finally {
      if (requestId === requestVersion.current) setLoading(false);
    }
  }, [assistantId, connectionConfig, pageSize, userId]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => void fetchFirstPage(query),
      query ? SEARCH_DELAY_MS : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [fetchFirstPage, query]);

  const search = useCallback((nextQuery: string) => {
    requestVersion.current += 1;
    setLoadingMore(false);
    setQuery(nextQuery);
  }, []);

  const refresh = useCallback(
    () => fetchFirstPage(query),
    [fetchFirstPage, query],
  );

  const loadMore = useCallback(async () => {
    if (
      !connectionConfig ||
      !assistantId ||
      !userId ||
      !hasMore ||
      isLoading ||
      isLoadingMore
    ) {
      return;
    }

    const requestId = ++requestVersion.current;
    const nextPage = page + 1;
    setLoadingMore(true);
    setError(null);
    try {
      const result = await listConversations(
        connectionConfig,
        assistantId,
        userId,
        nextPage,
        pageSize,
        query,
      );
      if (requestId !== requestVersion.current) return;
      const byId = new Map(conversationsById.current);
      result.conversations.forEach((conversation) => {
        byId.set(conversation.getId(), conversation);
      });
      const mergedConversations = sortConversationsNewestFirst([
        ...byId.values(),
      ]);
      conversationsById.current = new Map(
        mergedConversations.map((conversation) => [
          conversation.getId(),
          conversation,
        ]),
      );
      setEntries(mergedConversations.map(toConversationHistoryEntry));
      setHasMore(
        result.total > 0
          ? mergedConversations.length < result.total
          : result.conversations.length === pageSize,
      );
      setPage(nextPage);
    } catch (requestError) {
      if (requestId === requestVersion.current) {
        setError(getErrorMessage(requestError));
      }
    } finally {
      if (requestId === requestVersion.current) setLoadingMore(false);
    }
  }, [
    assistantId,
    connectionConfig,
    hasMore,
    isLoading,
    isLoadingMore,
    page,
    pageSize,
    query,
    userId,
  ]);

  const loadConversation = useCallback(async (conversationId: string) => {
    if (!connectionConfig || !assistantId) {
      throw new Error("Conversation history is unavailable.");
    }

    setRestoringConversationId(conversationId);
    setError(null);
    try {
      const messages: AssistantConversationMessage[] = [];
      let messagePage = 1;
      while (true) {
        const result = await listConversationMessages(
          connectionConfig,
          assistantId,
          conversationId,
          messagePage,
        );
        messages.push(...result.messages);
        if (
          result.messages.length < MESSAGE_PAGE_SIZE ||
          (result.total > 0 && messages.length >= result.total)
        ) {
          break;
        }
        messagePage += 1;
      }
      return toCarbonHistoryItems(messages);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      throw requestError;
    } finally {
      setRestoringConversationId(null);
    }
  }, [assistantId, connectionConfig]);

  return {
    entries,
    query,
    isLoading,
    isLoadingMore,
    restoringConversationId,
    hasMore,
    error,
    search,
    refresh,
    loadMore,
    loadConversation,
  };
}
