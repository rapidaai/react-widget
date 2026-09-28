import { useMemo, useState } from "react";
import type { ComponentType, PropsWithChildren } from "react";
import { ContainedList } from "@carbon/react";
import {
  HistoryContent,
  HistoryHeader,
  HistoryShell,
  HistoryToolbar,
} from "@carbon/ai-chat-components/es/react/history/index.js";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";
import "./conversation-history-panel.scss";

// Carbon exposes this component at runtime through its documented compound API,
// but the current package declaration omits the static property.
const ContainedListItem = (ContainedList as unknown as {
  ContainedListItem: ComponentType<PropsWithChildren>;
}).ContainedListItem;

export interface ConversationHistoryPanelProps {
  entries: ConversationHistoryEntry[];
  onClose: () => unknown;
  onNewConversation: () => unknown;
}

function getSearchValue(event: Event): string {
  if (event instanceof CustomEvent && typeof event.detail?.value === "string") {
    return event.detail.value;
  }
  return (event.target as HTMLInputElement | null)?.value ?? "";
}

export function ConversationHistoryPanel({
  entries,
  onClose,
  onNewConversation,
}: ConversationHistoryPanelProps) {
  const [query, setQuery] = useState("");
  const visibleEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return entries;
    return entries.filter((entry) =>
      entry.title.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [entries, query]);

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
        onSearchInput={(event: Event) => setQuery(getSearchValue(event))}
        onNewChatClick={() => void onNewConversation()}
      />
      <HistoryContent
        resultsLabel={query ? "Results" : "Recent conversations"}
        resultsCount={visibleEntries.length}
      >
        {visibleEntries.length > 0 ? (
          <ContainedList className="rapida-conversation-history__list">
            {visibleEntries.map((entry) => (
              <ContainedListItem key={entry.id}>
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
      </HistoryContent>
    </HistoryShell>
  );
}
