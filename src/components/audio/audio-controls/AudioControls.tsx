import { FC } from "react";
import { Channel } from "@rapidaai/react";
import { CarbonInputActionPortal } from "@/adapters/carbon";
import { AudioPanel, AudioPanelProps } from "@/components/audio/audio-panel";
import { TextVoiceAction } from "@/components/audio/text-voice-action";

export interface AudioControlsProps extends AudioPanelProps {
  channel: Channel;
  voiceEnabled?: boolean;
  hasText: boolean;
  disabled?: boolean;
  onStartVoice: () => unknown;
}

export const AudioControls: FC<AudioControlsProps> = ({
  channel,
  voiceEnabled = false,
  hasText,
  disabled = false,
  onStartVoice,
  ...audioPanelProps
}) => {
  const isAudioMode = voiceEnabled && channel === Channel.Audio;

  if (!isAudioMode) {
    if (!voiceEnabled || hasText) return null;
    return (
      <CarbonInputActionPortal>
        <TextVoiceAction
          disabled={disabled}
          isConnecting={audioPanelProps.isConnecting}
          onSelect={onStartVoice}
        />
      </CarbonInputActionPortal>
    );
  }

  return (
    <AudioPanel {...audioPanelProps} />
  );
};
