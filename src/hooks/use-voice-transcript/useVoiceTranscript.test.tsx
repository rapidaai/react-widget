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

  it("does not restore a stale pending transcript when voice is reopened", () => {
    const staleMessage = [{
      id: "voice-old",
      role: MessageRole.User,
      status: MessageStatus.Pending,
      messages: ["old transcript"],
    }] as any;
    const { result, rerender } = renderHook(
      ({ messages, channel }) => useVoiceTranscript(messages, channel),
      { initialProps: { messages: staleMessage, channel: Channel.Text } },
    );

    rerender({ messages: staleMessage, channel: Channel.Audio });
    expect(result.current).toBe("");

    rerender({
      channel: Channel.Audio,
      messages: [
        ...staleMessage,
        {
          id: "voice-new",
          role: MessageRole.User,
          status: MessageStatus.Pending,
          messages: ["new transcript"],
        },
      ] as any,
    });
    expect(result.current).toBe("new transcript");
  });

  it("shows a new transcript that arrives while voice mode opens", () => {
    const { result, rerender } = renderHook(
      ({ messages, channel }) => useVoiceTranscript(messages, channel),
      { initialProps: { messages: [] as any, channel: Channel.Text } },
    );

    rerender({
      channel: Channel.Audio,
      messages: [{
        id: "voice-new",
        role: MessageRole.User,
        status: MessageStatus.Pending,
        messages: ["hello"],
      }] as any,
    });

    expect(result.current).toBe("hello");
  });
});
