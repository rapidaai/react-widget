import { FC } from "react";
import { Button } from "@carbon/react";
import { InProgress, VoiceMode } from "@carbon/icons-react";

export interface TextVoiceActionProps {
  disabled: boolean;
  isConnecting: boolean;
  onSelect: () => unknown;
}

export const TextVoiceAction: FC<TextVoiceActionProps> = ({
  disabled,
  isConnecting,
  onSelect,
}) => (
  <Button
    type="button"
    kind="ghost"
    size="sm"
    hasIconOnly
    tooltipPosition="top"
    aria-label={isConnecting ? "Connecting" : "Voice"}
    className="rapida-text-voice-action"
    disabled={disabled || isConnecting}
    onClick={() => void onSelect()}
    iconDescription={isConnecting ? "Connecting" : "Voice"}
    renderIcon={isConnecting ? InProgress : VoiceMode}
  />
);
