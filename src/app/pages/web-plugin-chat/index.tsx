import { FC, useEffect, useState } from "react";
import { AssistantWebpluginDeployment, VoiceAgent } from "@rapidaai/react";
import { ChatComponent } from "@/app/pages/v3";

type State = "loading" | "ready" | "error";

export const WebPluginChat: FC<{ voiceAgent: VoiceAgent }> = ({
  voiceAgent,
}) => {
  const [deployment, setDeployment] =
    useState<AssistantWebpluginDeployment | null>(null);
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setState("loading");
    voiceAgent
      .getAssistant()
      .then((ex) => {
        if (ex.getSuccess()) {
          const webDeploy = ex.getData()?.getWebplugindeployment();
          if (webDeploy) {
            setDeployment(webDeploy);
            setState("ready");
          } else {
            setError("No web plugin deployment found for this assistant.");
            setState("error");
          }
        } else {
          setError("Failed to load assistant. Check assistant_id and token.");
          setState("error");
        }
      })
      .catch((err) => {
        setError(
          err?.message || "Failed to connect. Check api_base and network.",
        );
        setState("error");
      });
  }, [voiceAgent]);

  if (state === "ready" && deployment) {
    return <ChatComponent deployment={deployment} voiceAgent={voiceAgent} />;
  }

  if (state === "error") {
    console.error("[Rapida Widget]", error);
  }

  // Loading or error — render nothing in production,
  // but log errors to console for debugging
  return null;
};
