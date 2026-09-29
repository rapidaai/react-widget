import type { VoiceAgent } from "@rapidaai/react";

interface ConversationAwareAgent {
  changeConversation: (conversationId: string) => void;
}

export function initializeAgentConversation(
  agent: VoiceAgent,
  conversationId?: string,
): VoiceAgent {
  if (conversationId) {
    (agent as unknown as ConversationAwareAgent).changeConversation(conversationId);
  }
  return agent;
}
