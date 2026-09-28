import { fireEvent, render, screen } from "@testing-library/react";
import { CatastrophicErrorChat } from "./CatastrophicErrorChat";

const updateCatastrophicErrorPanel = jest.fn();

jest.mock("@carbon/ai-chat", () => {
  const renderChat = (type: string) => (props: any) => {
    const instance = { updateCatastrophicErrorPanel };
    void props.onBeforeRender?.(instance);
    return (
      <div data-testid={type} data-open={String(props.openChatByDefault)}>
        <button
          onClick={() =>
            props.onViewChange?.(
              { newViewState: { mainWindow: false } },
              instance,
            )
          }
        >
          Minimize
        </button>
      </div>
    );
  };

  return {
    CarbonTheme: { G10: "g10", G100: "g100" },
    ChatContainer: renderChat("chat-container"),
    ChatCustomElement: renderChat("chat-custom-element"),
    CornersType: { SQUARE: "square" },
    MinimizeButtonIconType: { MINIMIZE: "minimize" },
    LayoutCustomProperties: {
      width: "width",
      height: "height",
      max_height: "max_height",
      bottom_position: "bottom_position",
      top_position: "top_position",
      right_position: "right_position",
      left_position: "left_position",
      launcher_position_bottom: "launcher_position_bottom",
      launcher_position_right: "launcher_position_right",
    },
  };
});

describe("CatastrophicErrorChat", () => {
  beforeEach(() => updateCatastrophicErrorPanel.mockClear());

  it("opens Carbon's catastrophic panel for deployment failures", () => {
    render(
      <CatastrophicErrorChat
        error="Server unavailable"
        config={{ layout: { mode: "floating" } }}
      />,
    );

    expect(screen.getByTestId("chat-container")).toHaveAttribute(
      "data-open",
      "true",
    );
    expect(updateCatastrophicErrorPanel).toHaveBeenCalledWith({
      isOpen: true,
      title: "Unable to connect",
      bodyText: "Server unavailable",
      hideRetryButton: true,
    });
  });

  it("fills an inline custom-element shell", () => {
    render(
      <CatastrophicErrorChat
        error="Server unavailable"
        config={{ layout: { mode: "inline" } }}
        themeMode="dark"
      />,
    );

    const shell = screen.getByTestId("chat-custom-element").parentElement;
    expect(shell).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("tracks a docked panel's view state and restores the page margin", () => {
    const onViewChange = jest.fn();
    const { unmount } = render(
      <CatastrophicErrorChat
        error="Server unavailable"
        config={{ layout: { mode: "docked-left" }, onViewChange }}
      />,
    );
    const chat = screen.getByTestId("chat-custom-element");

    fireEvent.click(screen.getByRole("button", { name: "Minimize" }));
    expect(chat.parentElement?.getAttribute("style")).toContain("width: 0px");
    expect(onViewChange).toHaveBeenCalledTimes(1);

    unmount();
  });
});
