import { render, renderHook, screen } from "@testing-library/react";
import { Channel } from "@rapidaai/react";
import { useChatProps, UseChatPropsOptions } from "./useChatProps";

jest.mock("@rapidaai/react", () => ({
  Channel: { Audio: "audio", Text: "text" },
}));

const customSendMessage = jest.fn();
const onBeforeRender = jest.fn();
const onViewChange = jest.fn();

function createOptions(
  overrides: Partial<UseChatPropsOptions> = {},
): UseChatPropsOptions {
  return {
    config: {},
    displayName: "Test Assistant",
    themeMode: "dark",
    layout: { mode: "floating", position: "top-left" },
    isCustomElement: false,
    inputDisabled: false,
    inputControlsVisible: true,
    channel: Channel.Text,
    customSendMessage: customSendMessage as never,
    onBeforeRender: onBeforeRender as never,
    onViewChange: onViewChange as never,
    inputControls: <span>Voice control</span>,
    isRestartPanelOpen: false,
    restartPanelElement: <span>Restart panel</span>,
    historyPanelElement: <span>History panel</span>,
    onOpenRestartPanel: jest.fn(),
    onOpenHistoryPanel: jest.fn(),
    ...overrides,
  };
}

describe("useChatProps", () => {
  it("builds Carbon defaults and preserves nested overrides", () => {
    const onOpenHistoryPanel = jest.fn();
    const onOpenRestartPanel = jest.fn();
    const { result } = renderHook(() =>
      useChatProps(
        createOptions({
          onOpenHistoryPanel,
          onOpenRestartPanel,
          config: {
            header: { title: "Custom title" },
            input: { maxInputCharacters: 500 },
            launcher: { isOn: false },
          },
        }),
      ),
    );

    expect(result.current).toMatchObject({
      assistantName: "Test Assistant",
      injectCarbonTheme: "g100",
      header: { title: "Custom title", showRestartButton: false },
      input: {
        maxInputCharacters: 500,
        isDisabled: false,
        isVisible: true,
      },
      launcher: { isOn: false },
      messaging: { customSendMessage },
    });
    expect(result.current.header).toMatchObject({
      title: "Custom title",
      showRestartButton: false,
      actions: [
        expect.objectContaining({ text: "Chat history" }),
        expect.objectContaining({ text: "Restart conversation" }),
      ],
    });
    expect(result.current.history).toEqual({
      isOn: true,
      showMobileMenu: false,
      startClosed: true,
    });

    const actions = result.current.header?.actions ?? [];
    (actions[0].onClick as () => void)();
    (actions[1].onClick as () => void)();
    expect(onOpenHistoryPanel).toHaveBeenCalledTimes(1);
    expect(onOpenRestartPanel).toHaveBeenCalledTimes(1);
  });

  it("hides Carbon text input in audio mode and composes input content", () => {
    const { result } = renderHook(() =>
      useChatProps(
        createOptions({
          channel: Channel.Audio,
          config: {
            renderWriteableElements: {
              afterInputElement: <span>Custom content</span>,
            },
          },
        }),
      ),
    );

    expect(result.current.input?.isVisible).toBe(false);
    render(result.current.renderWriteableElements?.afterInputElement);
    expect(screen.getByText("Voice control")).toBeVisible();
    expect(screen.getByText("Custom content")).toBeVisible();
  });
});
