import { FC } from "react";
import { Button } from "@carbon/react";
import {
  Chat,
  InProgress,
  Microphone,
  MicrophoneOff,
  StopFilledAlt,
} from "@carbon/icons-react";
import { DeviceSelector } from "@/components/audio/device-selector";
import {
  FrequencyBars,
  FrequencyBarsProps,
} from "@/components/audio/frequency-bars";
import { VoiceTranscriptDisplay } from "@/components/audio/voice-transcript-display";
import "../audio-controls/audio-controls.scss";

export interface AudioPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  frequencies: FrequencyBarsProps["frequencies"];
  transcript?: string;
  devices: MediaDeviceInfo[];
  activeDeviceId: string;
  onToggleMute: () => unknown;
  onSwitchToText: () => unknown;
  onStop: () => unknown;
  onDeviceChange: (id: string) => unknown;
}

export const AudioPanel: FC<AudioPanelProps> = ({
  isConnected,
  isConnecting,
  isMuted,
  frequencies,
  transcript,
  devices,
  activeDeviceId,
  onToggleMute,
  onSwitchToText,
  onStop,
  onDeviceChange,
}) => (
  <div
    className="rapida-audio"
    data-testid="message-input-controls"
    data-floating-menu-container
  >
    <div className="rapida-audio__actions">
      <Button
        type="button"
        kind="ghost"
        size="sm"
        hasIconOnly
        tooltipPosition="top"
        className={isMuted ? "rapida-audio__mute--muted" : "rapida-audio__mute"}
        disabled={!isConnected}
        onClick={() => void onToggleMute()}
        iconDescription={isMuted ? "Unmute" : "Mute"}
        renderIcon={isMuted ? MicrophoneOff : Microphone}
      />

      <div className="rapida-audio__status">
        <FrequencyBars frequencies={frequencies} isMuted={isMuted} />
        <VoiceTranscriptDisplay
          transcript={transcript}
          isConnecting={isConnecting}
        />
      </div>

      {devices.length > 0 && (
        <DeviceSelector
          devices={devices}
          activeDeviceId={activeDeviceId}
          onDeviceChange={(id) => void onDeviceChange(id)}
        />
      )}

      <Button
        type="button"
        kind="ghost"
        size="sm"
        hasIconOnly
        tooltipPosition="top"
        onClick={() => void onSwitchToText()}
        iconDescription="Text"
        renderIcon={Chat}
      />
      <Button
        type="button"
        kind="ghost"
        size="sm"
        hasIconOnly
        tooltipPosition="top"
        className="rapida-audio__stop"
        disabled={!isConnected && !isConnecting}
        onClick={() => void onStop()}
        iconDescription="Stop"
        renderIcon={isConnecting ? InProgress : StopFilledAlt}
      />
    </div>
  </div>
);
