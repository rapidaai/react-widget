import { useCallback, useMemo } from "react";
import {
  useConnectAgent,
  useInputModeToggleAgent,
  useMuteAgent,
  useMultibandMicrophoneTrackVolume,
  useSelectInputDeviceAgent,
  VoiceAgent,
} from "@rapidaai/react";

const QUIET_FREQUENCIES = Array.from({ length: 5 }, () => [0.02]);

export function useAudioControls(voiceAgent: VoiceAgent) {
  const { channel, handleVoiceToggle, handleTextToggle } =
    useInputModeToggleAgent(voiceAgent);
  const {
    isConnected,
    isConnecting,
    handleConnectAgent,
    handleDisconnectAgent,
  } = useConnectAgent(voiceAgent);
  const { isMuted, handleToggleMute } = useMuteAgent(voiceAgent);
  const volume = useMultibandMicrophoneTrackVolume(voiceAgent, 5, 0.05, 0.85);
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useSelectInputDeviceAgent({ voiceAgent, requestPermissions: true });

  const frequencies = useMemo(() => {
    if (isMuted || volume.length === 0) return QUIET_FREQUENCIES;
    return volume;
  }, [isMuted, volume]);

  const startVoice = useCallback(async () => {
    await handleVoiceToggle();
    if (!isConnected) await handleConnectAgent();
  }, [handleVoiceToggle, isConnected, handleConnectAgent]);

  const selectDevice = useCallback(
    async (id: string) => {
      if (id !== activeDeviceId) await setActiveMediaDevice(id);
    },
    [activeDeviceId, setActiveMediaDevice],
  );

  return {
    channel,
    isConnected,
    isConnecting,
    isMuted,
    frequencies,
    devices,
    activeDeviceId,
    startVoice,
    selectDevice,
    toggleMute: handleToggleMute,
    switchToText: handleTextToggle,
    stopVoice: handleDisconnectAgent,
  };
}
