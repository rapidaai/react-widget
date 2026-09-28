import { act, render, screen } from "@testing-library/react";
import { App } from "./index";

const mockUseEnvironment = jest.fn();
const mockWebPluginChat = jest.fn();
const mockWithCustomEndpoint = jest.fn();
const mockDefaultConnectionConfig = jest.fn();
const mockWithWebpluginClient = jest.fn();
const mockAgentConfig = jest.fn();
const mockInputOptions = jest.fn();
const mockVoiceAgent = jest.fn();

jest.mock("@/hooks/use-environment", () => ({
  useEnvironment: () => mockUseEnvironment(),
}));
jest.mock("@/app/pages/web-plugin-chat", () => ({
  WebPluginChat: (props: unknown) => {
    mockWebPluginChat(props);
    return <div>Web plugin chat</div>;
  },
}));
jest.mock("@rapidaai/react", () => ({
  Channel: { Audio: "audio", Text: "text" },
  ConnectionConfig: {
    DefaultConnectionConfig: (...args: unknown[]) =>
      mockDefaultConnectionConfig(...args),
    WithWebpluginClient: (...args: unknown[]) =>
      mockWithWebpluginClient(...args),
  },
  AgentConfig: function (...args: unknown[]) {
    return mockAgentConfig(...args);
  },
  InputOptions: function (...args: unknown[]) {
    return mockInputOptions(...args);
  },
  VoiceAgent: function (...args: unknown[]) {
    return mockVoiceAgent(...args);
  },
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWithCustomEndpoint.mockReturnValue({ connection: true });
    mockDefaultConnectionConfig.mockReturnValue({
      withCustomEndpoint: mockWithCustomEndpoint,
    });
    mockWithWebpluginClient.mockReturnValue({ webPluginClient: true });
    mockInputOptions.mockReturnValue({ inputOptions: true });
    mockAgentConfig.mockReturnValue({ agentConfig: true });
    mockVoiceAgent.mockReturnValue({ voiceAgent: true, disconnect: jest.fn() });
    window.chatbotConfig = { name: "Configured Assistant" };
  });

  it("creates the agent and renders the deployment loader", () => {
    mockUseEnvironment.mockReturnValue({
      assistantId: "assistant-1",
      token: "token-1",
      apiBase: "https://assistant.example",
      user: { user_id: "user-1" },
      theme: { mode: "dark" },
    });

    render(<App />);

    expect(screen.getByText("Web plugin chat")).toBeVisible();
    expect(mockWithWebpluginClient).toHaveBeenCalledWith({
      ApiKey: "token-1",
      UserId: "user-1",
    });
    expect(mockWithCustomEndpoint).toHaveBeenCalledWith({
      assistant: "https://assistant.example",
      web: "https://assistant.example",
    });
    expect(mockVoiceAgent).toHaveBeenCalledWith(
      { connection: true },
      { agentConfig: true },
    );
    expect(mockWebPluginChat).toHaveBeenCalledWith(
      expect.objectContaining({
        voiceAgent: expect.objectContaining({ voiceAgent: true }),
        config: window.chatbotConfig,
        themeMode: "dark",
        conversationHistory: [],
        onRestartConversation: expect.any(Function),
      }),
    );
  });

  it("archives the conversation and replaces the agent after restart", () => {
    const firstAgent = { id: "first", disconnect: jest.fn() };
    const secondAgent = { id: "second", disconnect: jest.fn() };
    mockVoiceAgent
      .mockReturnValueOnce(firstAgent)
      .mockReturnValueOnce(secondAgent);
    mockUseEnvironment.mockReturnValue({
      assistantId: "assistant-1",
      token: "token-1",
      apiBase: "https://assistant.example",
      user: { user_id: "user-1" },
      theme: { mode: "dark" },
    });

    render(<App />);
    const firstProps = mockWebPluginChat.mock.calls.at(-1)?.[0] as any;
    act(() => {
      firstProps.onRestartConversation({
        id: "conversation:1",
        title: "First conversation",
      });
    });

    const restartedProps = mockWebPluginChat.mock.calls.at(-1)?.[0] as any;
    expect(firstAgent.disconnect).toHaveBeenCalled();
    expect(restartedProps.voiceAgent).toBe(secondAgent);
    expect(restartedProps.conversationHistory).toEqual([
      { id: "conversation:1", title: "First conversation" },
    ]);
  });

  it("renders nothing when required credentials are missing", () => {
    mockUseEnvironment.mockReturnValue({
      assistantId: undefined,
      token: undefined,
      apiBase: "https://assistant.example",
      user: { user_id: "user-1" },
      theme: { mode: "light" },
    });

    const { container } = render(<App />);

    expect(container).toBeEmptyDOMElement();
    expect(mockVoiceAgent).not.toHaveBeenCalled();
    expect(mockWebPluginChat).not.toHaveBeenCalled();
  });

  it("does not create a connection when only the token is missing", () => {
    mockUseEnvironment.mockReturnValue({
      assistantId: "assistant-1",
      token: undefined,
      apiBase: "https://assistant.example",
      user: { user_id: "user-1" },
      theme: { mode: "light" },
    });

    const { container } = render(<App />);

    expect(container).toBeEmptyDOMElement();
    expect(mockDefaultConnectionConfig).not.toHaveBeenCalled();
    expect(mockVoiceAgent).not.toHaveBeenCalled();
  });
});
