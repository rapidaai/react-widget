import { useCallback, useEffect, useRef, useState } from "react";
import {
  AssistantWebpluginDeployment,
  Channel,
  Message,
  MessageRole,
  MessageStatus,
  VoiceAgent,
} from "@rapidaai/react";
import {
  ChatInstance,
  HistoryItem,
  PublicConfigMessaging,
} from "@carbon/ai-chat";
import {
  createTranscriptRequest,
  createWelcomeMessage,
  getMessageKey,
  getMessageText,
  planAssistantSync,
  RenderedAssistantMessage,
} from "@/lib/message-sync";

interface PendingResponse {
  resolve: () => void;
  abortHandler: () => void;
  signal: AbortSignal;
}

export interface UseMessageSyncOptions {
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  channel: Channel;
  messages: Message[];
  inputDisabled: boolean;
  initialHistory?: HistoryItem[];
}

export function useMessageSync({
  deployment,
  voiceAgent,
  channel,
  messages,
  inputDisabled,
  initialHistory = [],
}: UseMessageSyncOptions) {
  const [chatInstance, setChatInstance] = useState<ChatInstance | null>(null);
  const renderedAssistantMessages = useRef<Map<string, RenderedAssistantMessage>>(
    new Map(),
  );
  const seenAgentUserMessageIds = useRef(new Set<string>());
  const voiceUserTranscriptIds = useRef(new Set<string>());
  const insertedVoiceTranscriptIds = useRef(new Set<string>());
  const insertingVoiceTranscriptIds = useRef(new Set<string>());
  const localTranscriptRequestIds = useRef(new Set<string>());
  const pendingResponses = useRef<PendingResponse[]>([]);
  const messageSyncQueue = useRef<Promise<void>>(Promise.resolve());
  const previousChannel = useRef(channel);
  const insertedHistory = useRef<HistoryItem[] | null>(null);

  const registerChatInstance = useCallback((instance: ChatInstance) => {
    setChatInstance(instance);
  }, []);

  const settleNextPendingResponse = useCallback(() => {
    const pending = pendingResponses.current.shift();
    if (!pending) return;
    pending.signal.removeEventListener("abort", pending.abortHandler);
    pending.resolve();
  }, []);

  const addUserTranscript = useCallback(
    (message: Message) => {
      const transcriptKey = getMessageKey(message);
      if (
        !chatInstance ||
        insertedVoiceTranscriptIds.current.has(transcriptKey) ||
        insertingVoiceTranscriptIds.current.has(transcriptKey)
      ) {
        return;
      }

      const text = getMessageText(message).trim();
      if (!text) return;

      const requestId = `rapida:${transcriptKey}`;
      insertingVoiceTranscriptIds.current.add(transcriptKey);
      localTranscriptRequestIds.current.add(requestId);
      void chatInstance.send(createTranscriptRequest(text, requestId)).then(
        () => {
          insertingVoiceTranscriptIds.current.delete(transcriptKey);
          insertedVoiceTranscriptIds.current.add(transcriptKey);
        },
        (error) => {
          insertingVoiceTranscriptIds.current.delete(transcriptKey);
          localTranscriptRequestIds.current.delete(requestId);
          console.error("Failed to add voice transcript to chat", error);
        },
      );
    },
    [chatInstance],
  );

  const syncAssistantMessage = useCallback(
    async (message: Message) => {
      if (!chatInstance) return;

      const messageKey = getMessageKey(message);
      const plan = planAssistantSync(
        message,
        renderedAssistantMessages.current.get(messageKey),
      );
      if (plan.kind === "none") return;

      await chatInstance.messaging.addMessageChunk(plan.chunk);
      renderedAssistantMessages.current.set(messageKey, plan.rendered);
      if (plan.settlesPendingResponse) settleNextPendingResponse();
    },
    [chatInstance, settleNextPendingResponse],
  );

  useEffect(() => {
    const classifyAsVoice =
      channel === Channel.Audio || previousChannel.current === Channel.Audio;
    previousChannel.current = channel;
    if (!chatInstance) return;

    const snapshot = messages.map((message) => ({
      ...message,
      messages: [...message.messages],
    }));
    messageSyncQueue.current = messageSyncQueue.current
      .then(async () => {
        for (const message of snapshot) {
          if (message.role !== MessageRole.User) {
            await syncAssistantMessage(message);
            continue;
          }

          const messageKey = getMessageKey(message);
          if (!seenAgentUserMessageIds.current.has(messageKey)) {
            seenAgentUserMessageIds.current.add(messageKey);
            if (classifyAsVoice) voiceUserTranscriptIds.current.add(messageKey);
          }

          if (
            message.status === MessageStatus.Complete &&
            voiceUserTranscriptIds.current.has(messageKey) &&
            !insertedVoiceTranscriptIds.current.has(messageKey)
          ) {
            addUserTranscript(message);
          }
        }
      })
      .catch((error) => {
        console.error("Unable to synchronize agent messages", error);
      });
  }, [channel, messages, chatInstance, addUserTranscript, syncAssistantMessage]);

  useEffect(() => {
    if (
      !chatInstance ||
      initialHistory.length === 0 ||
      insertedHistory.current === initialHistory
    ) {
      return;
    }

    insertedHistory.current = initialHistory;
    void chatInstance.messaging.insertHistory(initialHistory).catch((error) => {
      insertedHistory.current = null;
      console.error("Unable to restore conversation history", error);
    });
  }, [chatInstance, initialHistory]);

  const customSendMessage = useCallback<
    NonNullable<PublicConfigMessaging["customSendMessage"]>
  >(
    async (request, requestOptions, instance) => {
      registerChatInstance(instance);
      if (request.id && localTranscriptRequestIds.current.delete(request.id)) {
        instance.updateIsMessageLoadingCounter("reset");
        return;
      }

      const text = request.input.text?.trim() ?? "";
      if (!text) {
        if (initialHistory.length > 0) return;
        const welcome = createWelcomeMessage(
          deployment.getGreeting(),
          deployment.getSuggestionList(),
        );
        if (welcome) await instance.messaging.addMessage(welcome);
        return;
      }

      await voiceAgent.onSendText(text);
      return new Promise<void>((resolve) => {
        if (requestOptions.signal.aborted) {
          resolve();
          return;
        }

        const abortHandler = () => {
          pendingResponses.current = pendingResponses.current.filter(
            (pending) => pending.resolve !== resolve,
          );
          resolve();
        };
        pendingResponses.current.push({
          resolve,
          abortHandler,
          signal: requestOptions.signal,
        });
        requestOptions.signal.addEventListener("abort", abortHandler, { once: true });
      });
    },
    [deployment, initialHistory.length, voiceAgent, registerChatInstance],
  );

  useEffect(() => {
    chatInstance?.updateInputIsDisabled(inputDisabled);
  }, [chatInstance, inputDisabled]);

  useEffect(
    () => () => {
      pendingResponses.current.forEach((pending) => {
        pending.signal.removeEventListener("abort", pending.abortHandler);
        pending.resolve();
      });
      pendingResponses.current = [];
    },
    [],
  );

  return { chatInstance, registerChatInstance, customSendMessage };
}
