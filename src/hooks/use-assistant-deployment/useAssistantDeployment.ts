import { useEffect, useState } from "react";
import {
  AssistantWebpluginDeployment,
  VoiceAgent,
} from "@rapidaai/react";

type DeploymentState =
  | { status: "loading"; deployment: null; error: null }
  | { status: "ready"; deployment: AssistantWebpluginDeployment; error: null }
  | { status: "error"; deployment: null; error: string };

export function useAssistantDeployment(voiceAgent: VoiceAgent): DeploymentState {
  const [state, setState] = useState<DeploymentState>({
    status: "loading",
    deployment: null,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ status: "loading", deployment: null, error: null });

    voiceAgent
      .getAssistant()
      .then((response) => {
        if (!active) return;
        if (!response.getSuccess()) {
          setState({
            status: "error",
            deployment: null,
            error: "Failed to load assistant. Check assistant_id and token.",
          });
          return;
        }

        const deployment = response.getData()?.getWebplugindeployment();
        setState(
          deployment
            ? { status: "ready", deployment, error: null }
            : {
                status: "error",
                deployment: null,
                error: "No web plugin deployment found for this assistant.",
              },
        );
      })
      .catch((error) => {
        if (!active) return;
        setState({
          status: "error",
          deployment: null,
          error:
            error?.message ||
            "Failed to connect. Check api_base and network.",
        });
      });

    return () => {
      active = false;
    };
  }, [voiceAgent]);

  return state;
}
