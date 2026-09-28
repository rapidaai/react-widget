import { act, renderHook, waitFor } from "@testing-library/react";
import { Channel, VoiceAgent } from "@rapidaai/react";
import { useMessageSync } from "./useMessageSync";

describe("useMessageSync", () => {
  it("registers Carbon and sends the configured welcome content", async () => {
    const addMessage = jest.fn().mockResolvedValue(undefined);
    const updateInputIsDisabled = jest.fn();
    const instance = {
      messaging: { addMessage, addMessageChunk: jest.fn() },
      updateInputIsDisabled,
    } as any;
    const deployment = {
      getGreeting: () => "Welcome",
      getSuggestionList: () => ["Get started"],
    } as any;
    const voiceAgent = { onSendText: jest.fn() } as unknown as VoiceAgent;
    const { result } = renderHook(() =>
      useMessageSync({
        deployment,
        voiceAgent,
        channel: Channel.Text,
        messages: [],
        inputDisabled: true,
      }),
    );

    act(() => result.current.registerChatInstance(instance));
    await waitFor(() => expect(updateInputIsDisabled).toHaveBeenCalledWith(true));

    await act(async () => {
      await result.current.customSendMessage(
        { input: { message_type: "text", text: "" } } as any,
        { signal: new AbortController().signal } as any,
        instance,
      );
    });
    expect(addMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: "rapida-welcome" }),
    );
  });
});
