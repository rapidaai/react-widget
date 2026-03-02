import { FC, useEffect, useState } from "react";
import { AssistantWebpluginDeployment, VoiceAgent } from "@rapidaai/react";
import { ChatComponent } from "@/app/pages/v3";

export const WebPluginChat: FC<{ voiceAgent: VoiceAgent }> = ({
  voiceAgent,
}) => {
  const [deployment, setDeployment] =
    useState<AssistantWebpluginDeployment | null>(null);

  useEffect(() => {
    voiceAgent
      .getAssistant()
      .then((ex) => {
        if (ex.getSuccess()) {
          const webDeploy = ex.getData()?.getWebplugindeployment();
          if (webDeploy) {
            setDeployment(webDeploy);
          }
        }
      })
      .catch(() => {});
  }, [voiceAgent]);

  if (deployment) {
    return <ChatComponent deployment={deployment} voiceAgent={voiceAgent} />;
  }
  return <></>;
};
