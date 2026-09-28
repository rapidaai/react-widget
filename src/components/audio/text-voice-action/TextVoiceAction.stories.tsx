import { TextVoiceAction } from "./TextVoiceAction";

export default {
  title: "Audio/TextVoiceAction",
  component: TextVoiceAction,
};

export const Ready = {
  args: { disabled: false, isConnecting: false, onSelect: () => undefined },
};
export const Connecting = {
  args: { disabled: false, isConnecting: true, onSelect: () => undefined },
};
