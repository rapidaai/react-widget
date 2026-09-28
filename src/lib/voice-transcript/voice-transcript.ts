import { Channel, Message, MessageRole, MessageStatus } from "@rapidaai/react";

export function getActiveVoiceTranscript(messages: Message[], channel: Channel): string {
  if (channel !== Channel.Audio) return "";

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== MessageRole.User || message.status === MessageStatus.Complete) {
      continue;
    }

    const text = message.messages.join(" ").trim();
    if (text) return text;
  }

  return "";
}
