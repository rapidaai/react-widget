import { useEffect, useState } from "react";
import {
  AgentEvent,
  agentEventSelector,
  ConnectionState,
  VoiceAgent,
} from "@rapidaai/react";

const DEFAULT_CONNECTION_ERROR =
  "We couldn't connect to the assistant. Check your connection and try again.";

function getErrorMessage(eventArguments: unknown): string {
  if (!Array.isArray(eventArguments)) return DEFAULT_CONNECTION_ERROR;

  const message = eventArguments.length > 1
    ? eventArguments[1]
    : eventArguments[0];
  if (message instanceof Error) return message.message;
  if (typeof message === "string" && message.trim()) return message;
  return DEFAULT_CONNECTION_ERROR;
}

export function useAgentError(voiceAgent: VoiceAgent): string | null {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorSubscription = agentEventSelector(
      voiceAgent,
      AgentEvent.ErrorEvent,
    ).subscribe((eventArguments: unknown) => {
      setError(getErrorMessage(eventArguments));
    });
    const connectionSubscription = agentEventSelector(
      voiceAgent,
      AgentEvent.ConnectionStateEvent,
    ).subscribe((eventArguments: unknown) => {
      if (
        Array.isArray(eventArguments) &&
        eventArguments[0] === ConnectionState.Connected
      ) {
        setError(null);
      }
    });

    return () => {
      errorSubscription.unsubscribe();
      connectionSubscription.unsubscribe();
    };
  }, [voiceAgent]);

  return error;
}
