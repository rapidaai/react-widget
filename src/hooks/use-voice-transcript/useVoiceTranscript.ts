import { useMemo } from "react";
import { Channel, Message } from "@rapidaai/react";
import { getActiveVoiceTranscript } from "@/lib/voice-transcript";

export function useVoiceTranscript(messages: Message[], channel: Channel): string {
  return useMemo(
    () => getActiveVoiceTranscript(messages, channel),
    [messages, channel],
  );
}
