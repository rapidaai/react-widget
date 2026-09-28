import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { WebPluginChat } from "@/app/pages/web-plugin-chat";
import {
  AgentConfig,
  Channel,
  ConnectionConfig,
  InputOptions,
  VoiceAgent,
} from "@rapidaai/react";
import { useEnvironment } from "@/hooks/use-environment";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";

export const App: FC = memo(() => {
  const { assistantId, token, user, apiBase, theme } = useEnvironment();
  const [agentGeneration, setAgentGeneration] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationHistoryEntry[]
  >([]);
  useEffect(() => {
    if (!assistantId) {
      console.error(
        "Please provide an assistant_id for initialize the assistant.",
      );
      return;
    }
    if (!token) {
      console.error(
        "Please provide an authentication token for initialize the assistant.",
      );
      return;
    }
  }, [assistantId, token]);

  const connectionConfig = useMemo(() => {
    if (token && apiBase)
      return ConnectionConfig.DefaultConnectionConfig(
        ConnectionConfig.WithWebpluginClient({
          ApiKey: token,
          UserId: user.user_id,
        }),
      ).withCustomEndpoint({ assistant: apiBase, web: apiBase });
  }, [token, user.user_id, apiBase]);

  const agentConfig = useMemo(() => {
    if (assistantId)
      return new AgentConfig(
        assistantId,
        new InputOptions([Channel.Audio, Channel.Text], Channel.Text),
      );
  }, [assistantId]);

  const voiceAgent = useMemo(() => {
    if (connectionConfig && agentConfig)
      return new VoiceAgent(connectionConfig, agentConfig);
  }, [connectionConfig, agentConfig, agentGeneration]);

  useEffect(
    () => () => {
      void voiceAgent?.disconnect();
    },
    [voiceAgent],
  );

  const restartAgent = useCallback((entry?: ConversationHistoryEntry) => {
    if (entry) {
      setConversationHistory((current) => [
        entry,
        ...current.filter(({ id }) => id !== entry.id),
      ]);
    }
    setAgentGeneration((generation) => generation + 1);
  }, []);

  if (!voiceAgent) return null;

  return (
    <WebPluginChat
      voiceAgent={voiceAgent}
      config={window.chatbotConfig}
      themeMode={theme.mode}
      conversationHistory={conversationHistory}
      onRestartConversation={restartAgent}
    />
  );
});
