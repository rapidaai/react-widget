import { act, renderHook } from "@testing-library/react";
import { useChatController } from "./useChatController";

const registerChatInstance = jest.fn();
const applyCarbonInputStyles = jest.fn();
const updateCatastrophicErrorPanel = jest.fn();
let chatInstance: {
  updateCatastrophicErrorPanel: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
} | null = null;
let agentError: string | null = null;

const audioControls = {
  channel: "text",
  isConnected: false,
  isConnecting: false,
  isMuted: false,
  frequencies: [],
  devices: [],
  activeDeviceId: "",
  startVoice: jest.fn(),
  selectDevice: jest.fn(),
  toggleMute: jest.fn(),
  switchToText: jest.fn(),
  stopVoice: jest.fn(),
};

jest.mock("@rapidaai/react", () => ({
  Channel: { Audio: "audio", Text: "text" },
  MessageRole: { User: "user", System: "system" },
  useAgentMessages: () => ({ messages: [] }),
}));
jest.mock("@/components/chat", () => ({
  ConversationHistoryPanel: () => null,
  RestartConversationPanel: () => null,
}));
jest.mock("@/hooks/use-audio-controls", () => ({
  useAudioControls: () => audioControls,
}));
jest.mock("@/hooks/use-agent-error", () => ({
  useAgentError: () => agentError,
}));
jest.mock("@/hooks/use-carbon-input", () => ({
  useCarbonInputHasText: () => false,
}));
jest.mock("@/hooks/use-message-sync", () => ({
  useMessageSync: () => ({
    chatInstance,
    registerChatInstance,
    customSendMessage: jest.fn(),
  }),
}));
jest.mock("@/hooks/use-voice-transcript", () => ({
  useVoiceTranscript: () => "",
}));
jest.mock("@/adapters/carbon", () => ({
  applyCarbonInputStyles: (...args: unknown[]) =>
    applyCarbonInputStyles(...args),
}));

describe("useChatController", () => {
  const deployment = {
    getName: () => "Test Assistant",
    getInputaudio: () => true,
    getOutputaudio: () => true,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    chatInstance = null;
    agentError = null;
  });

  it("builds the Carbon defaults from explicit widget config", () => {
    const { result } = renderHook(() =>
      useChatController({
        deployment,
        voiceAgent: {} as any,
        config: { layout: { mode: "floating", position: "top-left" } },
        environmentThemeMode: "dark",
      }),
    );

    expect(result.current.isCustomElement).toBe(false);
    expect(result.current.chatProps).toMatchObject({
      assistantName: "Test Assistant",
      injectCarbonTheme: "g100",
      header: { showRestartButton: false, minimizeButtonIconType: "minimize" },
      launcher: { isOn: true },
      input: { isVisible: true },
    });
  });

  it("selects the custom element shell for inline mode", () => {
    const { result } = renderHook(() =>
      useChatController({
        deployment,
        voiceAgent: {} as any,
        config: { layout: { mode: "inline" } },
      }),
    );

    expect(result.current.isCustomElement).toBe(true);
    expect(result.current.shellStyle).toMatchObject({ width: "100%", height: "100%" });
  });

  it("forwards Carbon lifecycle callbacks and updates a docked shell", async () => {
    const configuredBeforeRender = jest.fn();
    const configuredViewChange = jest.fn();
    const { result, unmount } = renderHook(() =>
      useChatController({
        deployment,
        voiceAgent: {} as any,
        config: {
          layout: { mode: "docked-left" },
          onBeforeRender: configuredBeforeRender,
          onViewChange: configuredViewChange,
        },
      }),
    );
    const instance = {} as any;

    await act(async () => {
      await result.current.chatProps.onBeforeRender?.(instance);
    });
    expect(registerChatInstance).toHaveBeenCalledWith(instance);
    expect(applyCarbonInputStyles).toHaveBeenCalled();
    expect(configuredBeforeRender).toHaveBeenCalledWith(instance);
    expect(result.current.shellStyle.width).toBe("min(100vw, 450px)");

    act(() => {
      result.current.chatProps.onViewChange?.(
        { newViewState: { mainWindow: false } } as any,
        instance,
      );
    });
    expect(configuredViewChange).toHaveBeenCalled();
    expect(result.current.shellStyle.width).toBe(0);

    unmount();
    expect(document.body.style.marginLeft).toBe("");
  });

  it("opens and clears Carbon's catastrophic panel for agent failures", () => {
    chatInstance = {
      updateCatastrophicErrorPanel,
      on: jest.fn(),
      off: jest.fn(),
    };
    agentError = "Connection failed";
    const { rerender } = renderHook(() =>
      useChatController({
        deployment,
        voiceAgent: {} as any,
      }),
    );

    expect(updateCatastrophicErrorPanel).toHaveBeenCalledWith({
      isOpen: true,
      title: "Unable to connect",
      bodyText: "Connection failed",
      hideRetryButton: true,
    });

    agentError = null;
    rerender();
    expect(updateCatastrophicErrorPanel).toHaveBeenLastCalledWith({
      isOpen: false,
    });
  });
});
