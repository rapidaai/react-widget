import { FC, memo, useEffect, useMemo } from "react";
import { WebPluginChat } from "@/app/pages/web-plugin-chat";
import {
  HEADER_AUTH_ID,
  HEADER_API_KEY,
  HEADER_SOURCE_KEY,
} from "rapida-react";
import { useEnvironment } from "@/hooks/use-environment";
import {
  AgentConfig,
  Channel,
  ConnectionConfig,
  InputOptions,
  VoiceAgent,
  VoiceAgentContext,
  WEB_PLUGIN_SOURCE,
} from "rapida-react";
export const App: FC<{}> = memo(() => {
  const { assistantId, token, assistantVersion, user } = useEnvironment();
  useEffect(() => {
    if (!assistantId) {
      console.error(
        "Please provide an assistant_id for initialize the assistant."
      );
      return;
    }
    if (!token) {
      console.error(
        "Please provide an authentication token for initialize the assistant."
      );
      return;
    }
  }, [assistantId]);

  // Create configurations outside the render function
  const connectionConfig = useMemo(() => {
    if (token)
      return new ConnectionConfig({
        [HEADER_API_KEY]: token,
        [HEADER_AUTH_ID]: user.user_id,
        Client: {
          [HEADER_SOURCE_KEY]: WEB_PLUGIN_SOURCE,
        },
      });
  }, [token, user.user_id]);

  const agentConfig = useMemo(() => {
    if (assistantId)
      return new AgentConfig(
        assistantId,
        new InputOptions([Channel.Text], Channel.Text)
      );
  }, [assistantId, token]);

  return (
    <div className="pks_font-sans">
      {agentConfig && connectionConfig && (
        <VoiceAgentContext.Provider
          value={new VoiceAgent(connectionConfig, agentConfig)}
        >
          <WebPluginChat />
        </VoiceAgentContext.Provider>
      )}
    </div>
  );
});
