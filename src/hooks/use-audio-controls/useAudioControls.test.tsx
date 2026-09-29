import { act, renderHook } from "@testing-library/react";
import { VoiceAgent } from "@rapidaai/react";
import { useAudioControls } from "./useAudioControls";

const handleVoiceToggle = jest.fn();
const handleTextToggle = jest.fn();
const handleConnectAgent = jest.fn();
const handleDisconnectAgent = jest.fn();
const setActiveMediaDevice = jest.fn();
let isConnecting = false;

jest.mock("@rapidaai/react", () => ({
  useInputModeToggleAgent: () => ({
    channel: "text",
    handleVoiceToggle,
    handleTextToggle,
  }),
  useConnectAgent: () => ({
    isConnected: false,
    isConnecting,
    handleConnectAgent,
    handleDisconnectAgent,
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
  beforeEach(() => {
    jest.clearAllMocks();
    isConnecting = false;
  });

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

  it("disconnects an in-progress voice connection before returning to text", async () => {
    isConnecting = true;
    const { result } = renderHook(() => useAudioControls({} as VoiceAgent));

    await act(() => result.current.switchToText());

    expect(handleDisconnectAgent).toHaveBeenCalledTimes(1);
    expect(handleTextToggle).toHaveBeenCalledTimes(1);
    expect(handleDisconnectAgent.mock.invocationCallOrder[0]).toBeLessThan(
      handleTextToggle.mock.invocationCallOrder[0],
    );
  });
});
