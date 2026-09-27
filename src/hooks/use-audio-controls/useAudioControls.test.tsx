import { act, renderHook } from "@testing-library/react";
import { VoiceAgent } from "@rapidaai/react";
import { useAudioControls } from "./useAudioControls";

const handleVoiceToggle = jest.fn();
const handleConnectAgent = jest.fn();
const setActiveMediaDevice = jest.fn();

jest.mock("@rapidaai/react", () => ({
  useInputModeToggleAgent: () => ({
    channel: "text",
    handleVoiceToggle,
    handleTextToggle: jest.fn(),
  }),
  useConnectAgent: () => ({
    isConnected: false,
    isConnecting: false,
    handleConnectAgent,
    handleDisconnectAgent: jest.fn(),
  }),
  useMuteAgent: () => ({ isMuted: false, handleToggleMute: jest.fn() }),
  useMultibandMicrophoneTrackVolume: () => [],
  useSelectInputDeviceAgent: () => ({
    devices: [],
    activeDeviceId: "mic-1",
    setActiveMediaDevice,
  }),
}));

describe("useAudioControls", () => {
  beforeEach(() => jest.clearAllMocks());

  it("switches mode before connecting and ignores the active device", async () => {
    const { result } = renderHook(() => useAudioControls({} as VoiceAgent));
    await act(() => result.current.startVoice());
    expect(handleVoiceToggle.mock.invocationCallOrder[0]).toBeLessThan(
      handleConnectAgent.mock.invocationCallOrder[0],
    );

    await act(() => result.current.selectDevice("mic-1"));
    expect(setActiveMediaDevice).not.toHaveBeenCalled();
    await act(() => result.current.selectDevice("mic-2"));
    expect(setActiveMediaDevice).toHaveBeenCalledWith("mic-2");
  });
});
