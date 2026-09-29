import { act, renderHook, waitFor } from "@testing-library/react";
import { EnvironmentProvider } from "./environment-context";
import { useEnvironment } from "@/hooks/use-environment";

jest.mock("uuid", () => ({ v4: () => "generated-user-id" }));

describe("EnvironmentProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("lang");
  });

  afterEach(() => {
    document.documentElement.removeAttribute("lang");
  });

  it("maps widget configuration and augments user metadata", () => {
    window.chatbotConfig = {
      assistant_id: "assistant-1",
      assistant_version: "v2",
      api_base: "https://custom.example",
      token: "token-1",
      language: "fr",
      debug: true,
      user: {
        name: "Ada",
        user_id: "user-1",
        meta: { plan: "pro", source: "customer site" },
      },
      theme: { mode: "dark" },
    };

    const { result } = renderHook(() => useEnvironment(), {
      wrapper: EnvironmentProvider,
    });

    expect(result.current).toEqual({
      assistantId: "assistant-1",
      assistantVersion: "v2",
      apiBase: "https://custom.example",
      token: "token-1",
      language: "fr",
      debug: true,
      user: {
        name: "Ada",
        user_id: "user-1",
        meta: { plan: "pro", source: "customer site" },
      },
      theme: { mode: "dark" },
    });
  });

  it("creates and persists a guest id while applying defaults", () => {
    window.chatbotConfig = {};

    const { result } = renderHook(() => useEnvironment(), {
      wrapper: EnvironmentProvider,
    });

    expect(result.current).toMatchObject({
      apiBase: "https://assistant-01.in.rapida.ai",
      assistantVersion: null,
      language: "en",
      debug: false,
      user: {
        name: "Guest",
        user_id: "web_agent_generated-user-id",
        meta: { source: "web plugin" },
      },
      theme: { mode: "light" },
    });
    expect(localStorage.getItem("rpd__uuid")).toBe(
      "web_agent_generated-user-id",
    );
  });

  it("reuses a persisted guest id", () => {
    localStorage.setItem("rpd__uuid", "stored-user-id");
    window.chatbotConfig = {};

    const { result } = renderHook(() => useEnvironment(), {
      wrapper: EnvironmentProvider,
    });

    expect(result.current.user.user_id).toBe("stored-user-id");
  });

  it("tracks non-empty document language changes and disconnects cleanly", async () => {
    window.chatbotConfig = { language: "fr" };
    const disconnect = jest.spyOn(MutationObserver.prototype, "disconnect");
    const { result, unmount } = renderHook(() => useEnvironment(), {
      wrapper: EnvironmentProvider,
    });

    expect(result.current.language).toBe("fr");
    act(() => document.documentElement.setAttribute("lang", "de"));
    await waitFor(() => expect(result.current.language).toBe("de"));
    expect(window.chatbotConfig.language).toBe("de");

    unmount();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});
