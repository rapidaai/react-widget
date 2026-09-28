import { initializeAgentConversation } from "./initialize-conversation";

describe("initializeAgentConversation", () => {
  it("sets an existing conversation before the agent connects", () => {
    const agent = { changeConversation: jest.fn() } as any;

    expect(initializeAgentConversation(agent, "conversation-1")).toBe(agent);
    expect(agent.changeConversation).toHaveBeenCalledWith("conversation-1");
  });

  it("leaves a new conversation unassigned", () => {
    const agent = { changeConversation: jest.fn() } as any;

    initializeAgentConversation(agent);

    expect(agent.changeConversation).not.toHaveBeenCalled();
  });
});
