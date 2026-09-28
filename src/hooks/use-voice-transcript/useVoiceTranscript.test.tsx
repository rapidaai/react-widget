import { renderHook } from "@testing-library/react";
import { Channel, MessageRole, MessageStatus } from "@rapidaai/react";
import { useVoiceTranscript } from "./useVoiceTranscript";

describe("useVoiceTranscript", () => {
  it("selects the current voice transcript", () => {
    const messages = [{
      id: "voice-1",
      role: MessageRole.User,
      status: MessageStatus.Pending,
      messages: ["hello", "world"],
    }] as any;
    const { result } = renderHook(() =>
      useVoiceTranscript(messages, Channel.Audio),
    );
    expect(result.current).toBe("hello world");
  });
});
