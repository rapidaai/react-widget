import { useEffect, useRef, useState } from "react";
import type { ComponentType, PropsWithChildren } from "react";
import {
  ContainedList,
  InlineLoading,
  InlineNotification,
} from "@carbon/react";
import {
  HistoryContent,
  HistoryHeader,
  HistoryShell,
  HistoryToolbar,
} from "@carbon/ai-chat-components/es/react/history/index.js";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";
import "./conversation-history-panel.scss";

interface ContainedListItemProps extends PropsWithChildren {
  disabled?: boolean;
  onClick?: () => void;
}

// Carbon publishes this documented compound component at runtime, while the
// package root declaration currently omits its static property.
const ContainedListItem = (ContainedList as unknown as {
  ContainedListItem: ComponentType<ContainedListItemProps>;
}).ContainedListItem;

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
          <InlineLoading
            className="rapida-conversation-history__loading"
            description="Loading conversations"
          />
        ) : entries.length > 0 ? (
          <ContainedList className="rapida-conversation-history__list">
            {entries.map((entry) => (
              <ContainedListItem
                key={entry.id}
                disabled={Boolean(restoringConversationId)}
                onClick={() => void onSelectConversation?.(entry)}
              >
                <span className="rapida-conversation-history__title">
                  {entry.title}
                </span>
                {entry.date && (
                  <span className="rapida-conversation-history__date">
                    {entry.date}
                  </span>
                )}
              </ContainedListItem>
            ))}
          </ContainedList>
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
        <div ref={loadMoreRef} className="rapida-conversation-history__load-more">
          {isLoadingMore && <InlineLoading description="Loading more conversations" />}
        </div>
      </HistoryContent>
    </HistoryShell>
  );
}
