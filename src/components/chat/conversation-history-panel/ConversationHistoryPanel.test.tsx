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

  it("shows and filters recent conversations", () => {
    const onClose = jest.fn();
    render(
      <ConversationHistoryPanel
        entries={entries}
        onClose={onClose}
        onNewConversation={jest.fn()}
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
    expect(screen.getByText("Billing question")).toBeVisible();
    expect(screen.queryByText("Technical support")).toBeNull();

    fireEvent.change(screen.getByRole("textbox", { name: "Search chat history" }), {
      target: { value: "missing" },
    });
    expect(screen.getByText("No matching conversations")).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", { name: "Use native search event" }),
    );
    expect(screen.getByText("Technical support")).toBeVisible();
    expect(screen.queryByText("Billing question")).toBeNull();
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
});
