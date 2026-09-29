import { useMemo, useRef } from "react";
import { Channel, Message, MessageRole, MessageStatus } from "@rapidaai/react";
import { getActiveVoiceTranscript } from "@/lib/voice-transcript";

export function useVoiceTranscript(messages: Message[], channel: Channel): string {
  const previousChannel = useRef(channel);
  const previousMessages = useRef(messages);
  const ignoredMessageIds = useRef<ReadonlySet<string>>(new Set());

  if (channel !== previousChannel.current) {
    ignoredMessageIds.current = channel === Channel.Audio
      ? new Set(
          previousMessages.current
            .filter(
              (message) =>
                message.role === MessageRole.User &&
                message.status !== MessageStatus.Complete,
            )
            .map((message) => message.id),
        )
      : new Set();
    previousChannel.current = channel;
  }
  previousMessages.current = messages;

  return useMemo(
    () => getActiveVoiceTranscript(messages, channel, ignoredMessageIds.current),
    [messages, channel],
  );
}
