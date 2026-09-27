import { FC } from "react";

export const VoiceTranscriptDisplay: FC<{
  transcript?: string;
  isConnecting: boolean;
}> = ({ transcript = "", isConnecting }) => (
  <span
    className="rapida-audio__transcript"
    title={transcript || undefined}
  >
    {transcript || (isConnecting ? "Connecting…" : "Listening…")}
  </span>
);
