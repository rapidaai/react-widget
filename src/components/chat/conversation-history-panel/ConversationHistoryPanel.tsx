import { useEffect, useRef, useState } from "react";
import { InlineNotification } from "@carbon/react";
import {
  HistoryContent,
  HistoryHeader,
  HistoryLoading,
  HistoryPanel,
  HistoryPanelItems,
  HistorySearchItem,
  HistoryShell,
  HistoryToolbar,
} from "@carbon/ai-chat-components/es/react/history/index.js";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";
import "./conversation-history-panel.scss";

export interface ConversationHistoryPanelProps {
  entries: ConversationHistoryEntry[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  restoringConversationId?: string | null;
  hasMore?: boolean;
  error?: string | null;
  onClose: () => unknown;
  onNewConversation: () => unknown;
  onSearch?: (query: string) => unknown;
  onLoadMore?: () => unknown;
  onSelectConversation?: (entry: ConversationHistoryEntry) => unknown;
}

function getSearchValue(event: Event): string {
  if (event instanceof CustomEvent && typeof event.detail?.value === "string") {
    return event.detail.value;
  }
  return (event.target as HTMLInputElement | null)?.value ?? "";
}

export function ConversationHistoryPanel({
  entries,
  isLoading = false,
  isLoadingMore = false,
  restoringConversationId = null,
  hasMore = false,
  error = null,
  onClose,
  onNewConversation,
  onSearch,
  onLoadMore,
  onSelectConversation,
}: ConversationHistoryPanelProps) {
  const [query, setQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || isLoading || isLoadingMore || !onLoadMore) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void onLoadMore();
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  const handleSearch = (event: Event) => {
    const value = getSearchValue(event);
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <HistoryShell>
      <HistoryHeader
        headerTitle="Chat history"
        closeButtonLabel="Close chat history"
        showCloseAction
        onClose={() => void onClose()}
      />
      <HistoryToolbar
        newChatLabel="New conversation"
        searchAttributes={{
          "label-text": "Search chat history",
          placeholder: "Search chat history",
          size: "md",
        }}
        onSearchInput={handleSearch}
        onNewChatClick={() => void onNewConversation()}
      />
      <HistoryContent
        resultsLabel={query ? "Results" : "Recent conversations"}
        resultsCount={entries.length}
      >
        {error && (
          <InlineNotification
            className="rapida-conversation-history__notification"
            kind="error"
            lowContrast
            hideCloseButton
            title="Unable to load chat history"
            subtitle={error}
          />
        )}
        {isLoading ? (
          <HistoryLoading aria-label="Loading conversations" />
        ) : entries.length > 0 ? (
          <HistoryPanel>
            <HistoryPanelItems>
              {entries.map((entry) => (
                <HistorySearchItem
                  key={entry.id}
                  id={entry.id}
                  name={entry.title}
                  date={entry.date}
                  disabled={Boolean(restoringConversationId)}
                  onSelected={() => {
                    if (!restoringConversationId) {
                      void onSelectConversation?.(entry);
                    }
                  }}
                />
              ))}
            </HistoryPanelItems>
          </HistoryPanel>
        ) : (
          <div className="rapida-conversation-history__empty">
            <p>{query ? "No matching conversations" : "No chat history yet"}</p>
            <span>
              {query
                ? "Try a different search."
                : "Your recent conversations will appear here."}
            </span>
          </div>
        )}
        <div ref={loadMoreRef} aria-hidden="true" />
      </HistoryContent>
    </HistoryShell>
  );
}
