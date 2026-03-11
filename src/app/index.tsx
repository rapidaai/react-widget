import { FC, memo, useEffect, useMemo } from "react";
import { WebPluginChat } from "@/app/pages/web-plugin-chat";
import {
  AgentConfig,
  Channel,
  ConnectionConfig,
  InputOptions,
  VoiceAgent,
} from "@rapidaai/react";
import { useEnvironment } from "@/hooks/use-environment";

export const App: FC<{}> = memo(() => {
  const { assistantId, token, user, apiBase } = useEnvironment();
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
  }, [assistantId]);

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
  }, [connectionConfig, agentConfig]);

  return (
    <div className="pks_font-sans">
      {voiceAgent && <WebPluginChat voiceAgent={voiceAgent} />}
    </div>
  );
});
