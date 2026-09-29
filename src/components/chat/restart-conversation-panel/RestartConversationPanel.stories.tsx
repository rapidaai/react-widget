import { RestartConversationPanel } from "./RestartConversationPanel";

export default {
  title: "Chat/RestartConversationPanel",
  component: RestartConversationPanel,
};

export const Default = {
  args: {
    isRestarting: false,
    onCancel: () => undefined,
    onConfirm: () => undefined,
  },
};

export const Restarting = {
  args: { ...Default.args, isRestarting: true },
};
