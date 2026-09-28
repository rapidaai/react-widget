import { useEffect, useState } from "react";
import {
  AssistantWebpluginDeployment,
  VoiceAgent,
} from "@rapidaai/react";

type DeploymentState =
  | { status: "loading"; deployment: null; error: null }
  | { status: "ready"; deployment: AssistantWebpluginDeployment; error: null }
  | {
      status: "error";
      deployment: null;
      error: string;
      isConnectionFailure: boolean;
    };

function isConnectionFailure(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message
    : typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ? error.message
      : "";
  if (!message) return true;
  return /connect|network|fetch|transport|websocket|grpc|timeout|offline|unavailable/i.test(
    message,
  );
}

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
            isConnectionFailure: false,
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
                isConnectionFailure: false,
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
          isConnectionFailure: isConnectionFailure(error),
        });
      });

    return () => {
      active = false;
    };
  }, [voiceAgent]);

  return state;
}
