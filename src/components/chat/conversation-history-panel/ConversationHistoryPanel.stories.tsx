import { ConversationHistoryPanel } from "./ConversationHistoryPanel";

export default {
  title: "Chat/ConversationHistoryPanel",
  component: ConversationHistoryPanel,
};

export const WithHistory = {
  args: {
    entries: [
      {
        id: "conversation-2",
        title: "Help me compare the available plans",
        date: "Sep 28, 2026, 10:30 AM",
      },
      {
        id: "conversation-1",
        title: "How can I update my account?",
        date: "Sep 27, 2026, 8:15 PM",
      },
    ],
    onClose: () => undefined,
    onNewConversation: () => undefined,
  },
};

export const Empty = {
  args: { ...WithHistory.args, entries: [] },
};
