import { act, renderHook, waitFor } from "@testing-library/react";
import {
  Channel,
  Message,
  MessageRole,
  MessageStatus,
  VoiceAgent,
} from "@rapidaai/react";
import { useMessageSync } from "./useMessageSync";

function createInstance() {
  return {
    send: jest.fn().mockResolvedValue(undefined),
    messaging: {
      addMessage: jest.fn().mockResolvedValue(undefined),
      addMessageChunk: jest.fn().mockResolvedValue(undefined),
      insertHistory: jest.fn().mockResolvedValue(undefined),
    },
    updateInputIsDisabled: jest.fn(),
    updateIsMessageLoadingCounter: jest.fn(),
  } as any;
}

const deployment = {
  getGreeting: () => "Welcome",
  getSuggestionList: () => ["Get started"],
} as any;

describe("useMessageSync", () => {
  it("registers Carbon and sends the configured welcome content", async () => {
    const instance = createInstance();
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
    await waitFor(() =>
      expect(instance.updateInputIsDisabled).toHaveBeenCalledWith(true),
    );

    await act(async () => {
      await result.current.customSendMessage(
        { input: { message_type: "text", text: "" } } as any,
        { signal: new AbortController().signal } as any,
        instance,
      );
    });
    expect(instance.messaging.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: "rapida-welcome" }),
    );
  });

  it("hydrates restored history without adding the welcome message", async () => {
    const instance = createInstance();
    const voiceAgent = { onSendText: jest.fn() } as unknown as VoiceAgent;
    const initialHistory = [{
      time: "2026-09-28T10:00:00.000Z",
      message: {
        id: "history:user:1",
        input: { message_type: "text", text: "Earlier message" },
      },
    }] as any;
    const { result } = renderHook(() =>
      useMessageSync({
        deployment,
        voiceAgent,
        channel: Channel.Text,
        messages: [],
        inputDisabled: false,
        initialHistory,
      }),
    );

    act(() => result.current.registerChatInstance(instance));
    await waitFor(() =>
      expect(instance.messaging.insertHistory).toHaveBeenCalledWith(initialHistory),
    );
    await act(async () => {
      await result.current.customSendMessage(
        { input: { message_type: "text", text: "" } } as any,
        { signal: new AbortController().signal } as any,
        instance,
      );
    });
    expect(instance.messaging.addMessage).not.toHaveBeenCalled();
  });

  it("reports a failed history restore and allows it to be retried", async () => {
    const instance = createInstance();
    instance.messaging.insertHistory
      .mockRejectedValueOnce(new Error("restore failed"))
      .mockResolvedValueOnce(undefined);
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const initialHistory = [{
      time: "2026-09-28T10:00:00.000Z",
      message: { id: "history:user:1", input: { text: "Earlier message" } },
    }] as any;
    const voiceAgent = { onSendText: jest.fn() } as unknown as VoiceAgent;
    const initialProps = {
      deployment,
      voiceAgent,
      channel: Channel.Text,
      messages: [] as Message[],
      inputDisabled: false,
      initialHistory,
    };
    const { result, rerender } = renderHook(
      (props) => useMessageSync(props),
      { initialProps },
    );

    act(() => result.current.registerChatInstance(instance));
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith(
      "Unable to restore conversation history",
      expect.any(Error),
    ));

    rerender({ ...initialProps, initialHistory: [...initialHistory] });
    await waitFor(() => expect(instance.messaging.insertHistory).toHaveBeenCalledTimes(2));
    consoleError.mockRestore();
  });

  it("streams assistant updates and settles a pending text response", async () => {
    const instance = createInstance();
    const voiceAgent = {
      onSendText: jest.fn().mockResolvedValue(undefined),
    } as unknown as VoiceAgent;
    const initialProps = {
      deployment,
      voiceAgent,
      channel: Channel.Text,
      messages: [] as Message[],
      inputDisabled: false,
    };
    const { result, rerender } = renderHook(
      (props) => useMessageSync(props),
      { initialProps },
    );
    act(() => result.current.registerChatInstance(instance));

    const controller = new AbortController();
    let response: Promise<void> | undefined;
    await act(async () => {
      response = Promise.resolve(
        result.current.customSendMessage(
          { input: { message_type: "text", text: " hello " } } as any,
          { signal: controller.signal } as any,
          instance,
        ),
      );
      await Promise.resolve();
    });
    expect(voiceAgent.onSendText).toHaveBeenCalledWith("hello");

    const pending = {
      id: "assistant-1",
      role: MessageRole.System,
      status: MessageStatus.Pending,
      messages: ["Hel"],
    } as Message;
    rerender({ ...initialProps, messages: [pending] });
    await waitFor(() =>
      expect(instance.messaging.addMessageChunk).toHaveBeenCalledTimes(1),
    );

    rerender({
      ...initialProps,
      messages: [
        { ...pending, status: MessageStatus.Complete, messages: ["Hello"] },
      ],
    });
    await waitFor(() =>
      expect(instance.messaging.addMessageChunk).toHaveBeenCalledTimes(2),
    );
    await expect(response).resolves.toBeUndefined();

    rerender({
      ...initialProps,
      messages: [
        { ...pending, status: MessageStatus.Complete, messages: ["Hello"] },
      ],
    });
    await Promise.resolve();
    expect(instance.messaging.addMessageChunk).toHaveBeenCalledTimes(2);
  });

  it("adds completed audio transcripts once and ignores their local echo", async () => {
    const instance = createInstance();
    const voiceAgent = { onSendText: jest.fn() } as unknown as VoiceAgent;
    const initialProps = {
      deployment,
      voiceAgent,
      channel: Channel.Audio,
      messages: [] as Message[],
      inputDisabled: false,
    };
    const { result, rerender } = renderHook(
      (props) => useMessageSync(props),
      { initialProps },
    );
    act(() => result.current.registerChatInstance(instance));

    const transcript = {
      id: "voice-1",
      role: MessageRole.User,
      status: MessageStatus.Complete,
      messages: [" Voice transcript "],
    } as Message;
    rerender({ ...initialProps, messages: [transcript] });
    await waitFor(() => expect(instance.send).toHaveBeenCalledTimes(1));

    const request = instance.send.mock.calls[0][0];
    await act(async () => {
      await result.current.customSendMessage(
        request,
        { signal: new AbortController().signal } as any,
        instance,
      );
    });
    expect(instance.updateIsMessageLoadingCounter).toHaveBeenCalledWith(
      "reset",
    );
    expect(voiceAgent.onSendText).not.toHaveBeenCalled();

    rerender({ ...initialProps, messages: [transcript] });
    await Promise.resolve();
    expect(instance.send).toHaveBeenCalledTimes(1);
  });

  it("handles aborted requests, empty welcomes, sync failures, and cleanup", async () => {
    const instance = createInstance();
    instance.messaging.addMessageChunk.mockRejectedValueOnce(
      new Error("chunk failed"),
    );
    const voiceAgent = {
      onSendText: jest.fn().mockResolvedValue(undefined),
    } as unknown as VoiceAgent;
    const emptyDeployment = {
      getGreeting: () => "",
      getSuggestionList: () => [],
    } as any;
    const initialProps = {
      deployment: emptyDeployment,
      voiceAgent,
      channel: Channel.Text,
      messages: [] as Message[],
      inputDisabled: false,
    };
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const { result, rerender, unmount } = renderHook(
      (props) => useMessageSync(props),
      { initialProps },
    );
    act(() => result.current.registerChatInstance(instance));

    await act(async () => {
      await result.current.customSendMessage(
        { input: { message_type: "text", text: "" } } as any,
        { signal: new AbortController().signal } as any,
        instance,
      );
    });
    expect(instance.messaging.addMessage).not.toHaveBeenCalled();

    const alreadyAborted = new AbortController();
    alreadyAborted.abort();
    await expect(
      result.current.customSendMessage(
        { input: { message_type: "text", text: "first" } } as any,
        { signal: alreadyAborted.signal } as any,
        instance,
      ),
    ).resolves.toBeUndefined();

    const abortLater = new AbortController();
    const pending = Promise.resolve(
      result.current.customSendMessage(
        { input: { message_type: "text", text: "second" } } as any,
        { signal: abortLater.signal } as any,
        instance,
      ),
    );
    await waitFor(() => expect(voiceAgent.onSendText).toHaveBeenCalledTimes(2));
    abortLater.abort();
    await expect(pending).resolves.toBeUndefined();

    rerender({
      ...initialProps,
      messages: [
        {
          id: "assistant-error",
          role: MessageRole.System,
          status: MessageStatus.Complete,
          messages: ["Failed chunk"],
        } as Message,
      ],
    });
    await waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith(
        "Unable to synchronize agent messages",
        expect.any(Error),
      ),
    );

    const cleanupResponse = Promise.resolve(
      result.current.customSendMessage(
        { input: { message_type: "text", text: "third" } } as any,
        { signal: new AbortController().signal } as any,
        instance,
      ),
    );
    await waitFor(() => expect(voiceAgent.onSendText).toHaveBeenCalledTimes(3));
    unmount();
    await expect(cleanupResponse).resolves.toBeUndefined();
    consoleError.mockRestore();
  });
});
