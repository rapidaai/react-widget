import { act, renderHook } from "@testing-library/react";
import { AgentEvent, ConnectionState, VoiceAgent } from "@rapidaai/react";
import { useAgentError } from "./useAgentError";

const observers = new Map<string, (value: unknown) => void>();
const unsubscribe = jest.fn();

jest.mock("@rapidaai/react", () => ({
  AgentEvent: {
    ErrorEvent: "onErrorEvent",
    ConnectionStateEvent: "onConnectionStateEvent",
  },
  ConnectionState: { Connected: "connected" },
  agentEventSelector: (_agent: unknown, event: string) => ({
    subscribe: (observer: (value: unknown) => void) => {
      observers.set(event, observer);
      return { unsubscribe };
    },
  }),
}));

describe("useAgentError", () => {
  beforeEach(() => {
    observers.clear();
    unsubscribe.mockClear();
  });

  it("shows agent failures and clears them after reconnecting", () => {
    const voiceAgent = {} as VoiceAgent;
    const { result, unmount } = renderHook(() => useAgentError(voiceAgent));

    act(() => {
      observers.get(AgentEvent.ErrorEvent)?.([
        "client",
        "No connection available to send text",
      ]);
    });
    expect(result.current).toBe("No connection available to send text");

    act(() => {
      observers.get(AgentEvent.ConnectionStateEvent)?.([
        ConnectionState.Connected,
      ]);
    });
    expect(result.current).toBeNull();

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });

  it("uses a safe fallback for malformed errors", () => {
    const voiceAgent = {} as VoiceAgent;
    const { result } = renderHook(() => useAgentError(voiceAgent));

    act(() => {
      observers.get(AgentEvent.ErrorEvent)?.(["client", null]);
    });

    expect(result.current).toContain("couldn't connect");
  });
});
