import { renderHook } from "@testing-library/react";
import { useChatController } from "./useChatController";

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
  useAgentMessages: () => ({ messages: [] }),
}));
jest.mock("@/hooks/use-audio-controls/useAudioControls", () => ({
  useAudioControls: () => audioControls,
}));
jest.mock("@/hooks/use-carbon-input/useCarbonInputHasText", () => ({
  useCarbonInputHasText: () => false,
}));
jest.mock("@/hooks/use-message-sync/useMessageSync", () => ({
  useMessageSync: () => ({
    chatInstance: null,
    registerChatInstance: jest.fn(),
    customSendMessage: jest.fn(),
  }),
}));
jest.mock("@/hooks/use-voice-transcript/useVoiceTranscript", () => ({
  useVoiceTranscript: () => "",
}));
jest.mock("@/adapters/carbon/apply-input-styles", () => ({
  applyCarbonInputStyles: jest.fn(),
}));

describe("useChatController", () => {
  const deployment = {
    getName: () => "Test Assistant",
    getInputaudio: () => true,
    getOutputaudio: () => true,
  } as any;

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
      header: { showRestartButton: true, minimizeButtonIconType: "minimize" },
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
});
