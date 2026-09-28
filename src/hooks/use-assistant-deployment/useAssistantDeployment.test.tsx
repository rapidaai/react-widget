import { renderHook, waitFor } from "@testing-library/react";
import { VoiceAgent } from "@rapidaai/react";
import { useAssistantDeployment } from "./useAssistantDeployment";

describe("useAssistantDeployment", () => {
  it("exposes a loaded web plugin deployment", async () => {
    const deployment = { getName: () => "Assistant" };
    const voiceAgent = {
      getAssistant: jest.fn().mockResolvedValue({
        getSuccess: () => true,
        getData: () => ({ getWebplugindeployment: () => deployment }),
      }),
    } as unknown as VoiceAgent;

    const { result } = renderHook(() => useAssistantDeployment(voiceAgent));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.deployment).toBe(deployment);
  });

  it("reports a missing deployment", async () => {
    const voiceAgent = {
      getAssistant: jest.fn().mockResolvedValue({
        getSuccess: () => true,
        getData: () => ({ getWebplugindeployment: () => undefined }),
      }),
    } as unknown as VoiceAgent;

    const { result } = renderHook(() => useAssistantDeployment(voiceAgent));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current).toMatchObject({ isConnectionFailure: false });
  });

  it("reports unsuccessful and rejected assistant requests", async () => {
    const unsuccessfulAgent = {
      getAssistant: jest.fn().mockResolvedValue({
        getSuccess: () => false,
      }),
    } as unknown as VoiceAgent;
    const unsuccessful = renderHook(() =>
      useAssistantDeployment(unsuccessfulAgent),
    );
    await waitFor(() => expect(unsuccessful.result.current.status).toBe("error"));
    expect(unsuccessful.result.current.error).toContain("assistant_id");
    expect(unsuccessful.result.current).toMatchObject({
      isConnectionFailure: false,
    });
    unsuccessful.unmount();

    const rejectedAgent = {
      getAssistant: jest.fn().mockRejectedValue(new Error("Network down")),
    } as unknown as VoiceAgent;
    const rejected = renderHook(() => useAssistantDeployment(rejectedAgent));
    await waitFor(() => expect(rejected.result.current.status).toBe("error"));
    expect(rejected.result.current.error).toBe("Network down");
    expect(rejected.result.current).toMatchObject({ isConnectionFailure: true });
  });

  it("ignores a response after unmount", async () => {
    let resolveRequest!: (value: unknown) => void;
    const voiceAgent = {
      getAssistant: jest.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
      ),
    } as unknown as VoiceAgent;
    const { unmount } = renderHook(() => useAssistantDeployment(voiceAgent));

    unmount();
    resolveRequest({ getSuccess: () => true });
    await Promise.resolve();
  });
});
