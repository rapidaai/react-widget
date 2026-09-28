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
  <span style={{ display: "flex", order: -1 }}>
    <Button
      type="button"
      kind="ghost"
      size="sm"
      hasIconOnly
      tooltipPosition="top"
      aria-label={isConnecting ? "Connecting" : "Voice"}
      style={{ color: "var(--cds-interactive)" }}
      disabled={disabled || isConnecting}
      onClick={() => void onSelect()}
      iconDescription={isConnecting ? "Connecting" : "Voice"}
      renderIcon={isConnecting ? InProgress : VoiceMode}
    />
  </span>
);
