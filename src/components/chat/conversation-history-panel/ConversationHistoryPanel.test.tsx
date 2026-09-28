import { fireEvent, render, screen } from "@testing-library/react";
import { ConversationHistoryPanel } from "./ConversationHistoryPanel";

jest.mock("@carbon/ai-chat-components/es/react/history/index.js", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const Container = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    HistoryShell: Container,
    HistoryContent: Container,
    HistoryPanel: Container,
    HistoryPanelItems: Container,
    HistoryHeader: ({ headerTitle, onClose }: any) => (
      <header>
        {headerTitle}
        <button onClick={onClose}>Close chat history</button>
      </header>
    ),
    HistoryToolbar: ({
      onSearchInput,
      onNewChatClick,
      searchAttributes,
    }: any) => (
      <div data-search-size={searchAttributes?.size}>
        <input
          aria-label="Search chat history"
          onChange={(event) =>
            onSearchInput(
              new CustomEvent("cds-search-input", {
                detail: { value: event.currentTarget.value },
              }),
            )
          }
        />
        <button
          onClick={() => onSearchInput({ target: { value: "technical" } })}
        >
          Use native search event
        </button>
        <button onClick={onNewChatClick}>New conversation</button>
      </div>
    ),
  };
});

describe("ConversationHistoryPanel", () => {
  const entries = [
    { id: "1", title: "Billing question", date: "Sep 28" },
    { id: "2", title: "Technical support" },
  ];

  it("shows conversations and delegates search to the server", () => {
    const onClose = jest.fn();
    const onSearch = jest.fn();
    const onSelectConversation = jest.fn();
    render(
      <ConversationHistoryPanel
        entries={entries}
        onClose={onClose}
        onNewConversation={jest.fn()}
        onSearch={onSearch}
        onSelectConversation={onSelectConversation}
      />,
    );

    expect(screen.getByText("Billing question")).toBeVisible();
    expect(screen.getByText("Technical support")).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Search chat history" }).parentElement,
    ).toHaveAttribute("data-search-size", "md");
    fireEvent.change(screen.getByRole("textbox", { name: "Search chat history" }), {
      target: { value: "billing" },
    });
    expect(onSearch).toHaveBeenCalledWith("billing");

    fireEvent.click(
      screen.getByRole("button", { name: "Use native search event" }),
    );
    expect(onSearch).toHaveBeenLastCalledWith("technical");

    fireEvent.click(screen.getByText("Billing question"));
    expect(onSelectConversation).toHaveBeenCalledWith(entries[0]);
  });

  it("uses the panel actions and renders the empty state", () => {
    const onClose = jest.fn();
    const onNewConversation = jest.fn();
    render(
      <ConversationHistoryPanel
        entries={[]}
        onClose={onClose}
        onNewConversation={onNewConversation}
      />,
    );

    expect(screen.getByText("No chat history yet")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Close chat history" }));
    fireEvent.click(screen.getByRole("button", { name: "New conversation" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onNewConversation).toHaveBeenCalledTimes(1);
  });

  it("shows Carbon loading and error states", () => {
    render(
      <ConversationHistoryPanel
        entries={[]}
        isLoading
        isLoadingMore
        error="History service unavailable"
        onClose={jest.fn()}
        onNewConversation={jest.fn()}
      />,
    );

    expect(screen.getByText("Unable to load chat history")).toBeVisible();
    expect(screen.getByText("History service unavailable")).toBeVisible();
    expect(screen.getByText("Loading conversations")).toBeVisible();
    expect(screen.getByText("Loading more conversations")).toBeVisible();
  });

  it("loads the next page when the sentinel becomes visible", () => {
    const onLoadMore = jest.fn();
    let intersectionCallback: IntersectionObserverCallback | undefined;
    const observe = jest.fn();
    const disconnect = jest.fn();
    const OriginalIntersectionObserver = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = jest.fn((callback) => {
      intersectionCallback = callback;
      return { observe, disconnect } as unknown as IntersectionObserver;
    }) as unknown as typeof IntersectionObserver;

    const { unmount } = render(
      <ConversationHistoryPanel
        entries={entries}
        hasMore
        onLoadMore={onLoadMore}
        onClose={jest.fn()}
        onNewConversation={jest.fn()}
      />,
    );

    expect(observe).toHaveBeenCalledTimes(1);
    intersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    globalThis.IntersectionObserver = OriginalIntersectionObserver;
  });
});
