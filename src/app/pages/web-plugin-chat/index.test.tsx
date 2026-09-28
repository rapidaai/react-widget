import { render, screen } from "@testing-library/react";
import { WebPluginChat } from ".";

let deploymentState: any;

jest.mock("@/hooks/use-assistant-deployment", () => ({
  useAssistantDeployment: () => deploymentState,
}));
jest.mock("@/app/pages/v3", () => ({
  ChatComponent: () => <div>Ready chat</div>,
}));
jest.mock("@/components/chat", () => ({
  CatastrophicErrorChat: ({ error }: { error: string }) => (
    <div>Catastrophic error: {error}</div>
  ),
}));

describe("WebPluginChat", () => {
  const voiceAgent = {} as any;

  it("renders nothing while deployment metadata loads", () => {
    deploymentState = { status: "loading", deployment: null, error: null };
    const { container } = render(<WebPluginChat voiceAgent={voiceAgent} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders chat when the deployment is ready", () => {
    deploymentState = {
      status: "ready",
      deployment: {},
      error: null,
    };
    render(<WebPluginChat voiceAgent={voiceAgent} />);
    expect(screen.getByText("Ready chat")).toBeVisible();
  });

  it("renders the Carbon catastrophic state for deployment errors", () => {
    deploymentState = {
      status: "error",
      deployment: null,
      error: "Server unavailable",
    };
    const consoleError = jest.spyOn(console, "error").mockImplementation();

    render(<WebPluginChat voiceAgent={voiceAgent} />);

    expect(
      screen.getByText("Catastrophic error: Server unavailable"),
    ).toBeVisible();
    consoleError.mockRestore();
  });
});
