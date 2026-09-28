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
  });
});
