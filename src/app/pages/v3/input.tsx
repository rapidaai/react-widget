import {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
} from "react";
import { Button, Dropdown } from "@carbon/react";
import {
  useConnectAgent,
  useInputModeToggleAgent,
  useMuteAgent,
  useMultibandMicrophoneTrackVolume,
  useSelectInputDeviceAgent,
  Channel,
  VoiceAgent,
} from "@rapidaai/react";
import {
  AudioConsole,
  Chat,
  InProgress,
  Microphone,
  MicrophoneOff,
  StopFilled,
} from "@carbon/icons-react";

export const AudioControls: FC<{
  voiceAgent: VoiceAgent;
  voiceEnabled?: boolean;
}> = ({ voiceAgent, voiceEnabled = false }) => {
  const { channel } = useInputModeToggleAgent(voiceAgent);

  if (!voiceEnabled) return null;

  return (
    <div
      data-rounded="bottom"
      data-stacked={channel === Channel.Audio ? true : undefined}
      style={audioSlotStyle}
    >
      {channel === Channel.Audio ? (
        <AudioPanel voiceAgent={voiceAgent} />
      ) : (
        <StartVoiceButton voiceAgent={voiceAgent} />
      )}
    </div>
  );
};

const StartVoiceButton: FC<{ voiceAgent: VoiceAgent }> = ({ voiceAgent }) => {
  const { handleVoiceToggle } = useInputModeToggleAgent(voiceAgent);
  const { handleConnectAgent, isConnected, isConnecting } =
    useConnectAgent(voiceAgent);

  return (
    <Button
      type="button"
      kind="ghost"
      size="md"
      renderIcon={isConnecting ? InProgress : AudioConsole}
      disabled={isConnecting}
      onClick={async () => {
        await handleVoiceToggle();
        if (!isConnected) await handleConnectAgent();
      }}
    >
      {isConnecting ? "Connecting" : "Voice"}
    </Button>
  );
};

const AudioPanel: FC<{ voiceAgent: VoiceAgent }> = ({ voiceAgent }) => {
  const localMultibandVolume = useMultibandMicrophoneTrackVolume(
    voiceAgent,
    5,
    0.05,
    0.85,
  );
  const { isConnected, isConnecting, handleDisconnectAgent } =
    useConnectAgent(voiceAgent);
  const { handleTextToggle } = useInputModeToggleAgent(voiceAgent);
  const { isMuted, handleToggleMute } = useMuteAgent(voiceAgent);

  const { devices, activeDeviceId, setActiveMediaDevice } =
    useSelectInputDeviceAgent({
      voiceAgent,
      requestPermissions: true,
    });

  const activeDeviceLabel = useMemo(() => {
    const device = devices.find((item) => item.deviceId === activeDeviceId);
    if (device) {
      const label = device.label || "Unknown Device";
      return label.length > 25 ? `${label.substring(0, 22)}...` : label;
    }
    return "Select Microphone";
  }, [devices, activeDeviceId]);

  const handleDeviceChange = useCallback(
    async (id: string) => {
      if (id !== activeDeviceId) await setActiveMediaDevice(id);
    },
    [activeDeviceId, setActiveMediaDevice],
  );

  const frequencies = useMemo(() => {
    if (isMuted) return Array.from({ length: 5 }, () => [0.02]);
    return localMultibandVolume.length > 0
      ? localMultibandVolume
      : Array.from({ length: 5 }, () => [0.02]);
  }, [isMuted, localMultibandVolume]);

  return (
    <div style={audioToolbarStyle}>
      <Button
        type="button"
        kind={isMuted ? "danger--ghost" : "ghost"}
        size="md"
        hasIconOnly
        disabled={!isConnected}
        onClick={async () => {
          await handleToggleMute();
        }}
        iconDescription={isMuted ? "Unmute" : "Mute"}
        renderIcon={isMuted ? MicrophoneOff : Microphone}
      />

      <div style={audioStatusStyle}>
        <FrequencyBars frequencies={frequencies} isMuted={isMuted} />
        <DeviceSelector
          devices={devices}
          activeDeviceId={activeDeviceId}
          activeDeviceLabel={activeDeviceLabel}
          onDeviceChange={handleDeviceChange}
        />
      </div>

      <Button
        type="button"
        kind="ghost"
        size="md"
        hasIconOnly
        disabled={!isConnected}
        onClick={async () => {
          await handleTextToggle();
        }}
        iconDescription="Switch to text"
        renderIcon={Chat}
      />

      <Button
        type="button"
        kind="danger"
        size="md"
        hasIconOnly
        disabled={!isConnected && !isConnecting}
        onClick={async () => {
          await handleDisconnectAgent();
        }}
        iconDescription="Stop"
        renderIcon={isConnecting ? InProgress : StopFilled}
      />
    </div>
  );
};

const DeviceSelector: FC<{
  devices: MediaDeviceInfo[];
  activeDeviceId: string;
  activeDeviceLabel: string;
  onDeviceChange: (id: string) => void;
}> = ({ devices, activeDeviceId, activeDeviceLabel, onDeviceChange }) => {
  const deviceOptions = useMemo(
    () =>
      devices.map((device, idx) => ({
        id: device.deviceId,
        label: device.label || `Microphone ${idx + 1}`,
      })),
    [devices],
  );
  const selectedDevice = useMemo(
    () => deviceOptions.find((device) => device.id === activeDeviceId) ?? null,
    [activeDeviceId, deviceOptions],
  );

  return (
    <div style={deviceSelectorStyle}>
      <Dropdown
        id="rapida-device-selector"
        aria-label="Select Microphone"
        titleText="Select Microphone"
        hideLabel
        label={activeDeviceLabel}
        direction="top"
        size="md"
        items={deviceOptions}
        selectedItem={selectedDevice}
        itemToString={(item) => item?.label ?? ""}
        onChange={({ selectedItem }) => {
          if (selectedItem) void onDeviceChange(selectedItem.id);
        }}
      />
    </div>
  );
};

const FrequencyBars: FC<{
  frequencies: Float32Array[] | number[][];
  isMuted: boolean;
}> = ({ frequencies, isMuted }) => {
  const summedFrequencies = useMemo(
    () =>
      frequencies.map((bandFrequencies) => {
        if (!bandFrequencies || bandFrequencies.length === 0) return 0;
        const values = Array.from(bandFrequencies as ArrayLike<number>);
        const sumSquares = values.reduce((acc, val) => acc + val * val, 0);
        const rms = Math.sqrt(sumSquares / values.length);
        return Math.min(1, Math.pow(rms, 0.7) * 1.2);
      }),
    [frequencies],
  );

  return (
    <div style={frequencyBarsStyle} aria-hidden="true">
      {summedFrequencies.map((frequency, index) => {
        const height = 3 + Math.max(frequency, 0.05) * 15;
        const scale = !isMuted && frequency > 0.3 ? 1 + frequency * 0.1 : 1;

        return (
          <span
            key={`frequency-${index}`}
            style={{
              ...frequencyBarStyle,
              height,
              transform: `scaleY(${scale})`,
              backgroundColor: isMuted
                ? "var(--cds-support-error)"
                : "var(--cds-icon-interactive)",
            }}
          />
        );
      })}
    </div>
  );
};

const audioSlotStyle: CSSProperties = {
  borderTop: "1px solid var(--cds-border-subtle-01)",
  background: "var(--cds-layer)",
  padding: "0.5rem 1rem",
};

const audioToolbarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  minWidth: 0,
};

const audioStatusStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
};

const deviceSelectorStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const frequencyBarsStyle: CSSProperties = {
  width: "2.25rem",
  height: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.1875rem",
  flexShrink: 0,
};

const frequencyBarStyle: CSSProperties = {
  width: "0.25rem",
  minHeight: "0.1875rem",
  borderRadius: "999px",
  transition:
    "height 80ms ease-out, transform 80ms ease-out, background-color 200ms ease-out",
  willChange: "height, transform",
};
