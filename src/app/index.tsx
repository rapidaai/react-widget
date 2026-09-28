import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { WebPluginChat } from "@/app/pages/web-plugin-chat";
import {
  AgentConfig,
  Channel,
  ConnectionConfig,
  InputOptions,
  UserIdentifier,
  VoiceAgent,
} from "@rapidaai/react";
import { initializeAgentConversation } from "@/adapters/rapida";
import { useEnvironment } from "@/hooks/use-environment";

export const App: FC = memo(() => {
  const { assistantId, token, user, apiBase, theme } = useEnvironment();
  const [agentGeneration, setAgentGeneration] = useState(0);
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
    if (assistantId) {
      const nextConfig = new AgentConfig(
        assistantId,
        new InputOptions([Channel.Audio, Channel.Text], Channel.Text),
        undefined,
        undefined,
      );
      nextConfig.userIdentifier = new UserIdentifier(user.user_id, user.name);
      return nextConfig;
    }
  }, [assistantId, user.name, user.user_id]);

  const voiceAgent = useMemo(() => {
    if (connectionConfig && agentConfig) {
      return initializeAgentConversation(
        new VoiceAgent(connectionConfig, agentConfig),
      );
    }
  }, [connectionConfig, agentConfig, agentGeneration]);

  useEffect(
    () => () => {
      void voiceAgent?.disconnect();
    },
    [voiceAgent],
  );

  const restartAgent = useCallback(() => {
    setAgentGeneration((generation) => generation + 1);
  }, []);

  if (!voiceAgent) return null;

  return (
    <WebPluginChat
      key={agentGeneration}
      voiceAgent={voiceAgent}
      config={window.chatbotConfig}
      themeMode={theme.mode}
      onRestartConversation={restartAgent}
    />
  );
});
