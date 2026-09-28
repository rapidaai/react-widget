import { AudioPanel } from "./AudioPanel";

export default {
  title: "Audio/AudioPanel",
  component: AudioPanel,
};

const commonArgs = {
  isConnected: true,
  isConnecting: false,
  isMuted: false,
  frequencies: [[0.1], [0.35], [0.8], [0.45], [0.2]],
  transcript: "Tell me about this product",
  devices: [],
  activeDeviceId: "",
  onToggleMute: () => undefined,
  onSwitchToText: () => undefined,
  onStop: () => undefined,
  onDeviceChange: () => undefined,
};

export const Listening = { args: commonArgs };
export const Muted = { args: { ...commonArgs, isMuted: true } };
export const Connecting = {
  args: { ...commonArgs, isConnected: false, isConnecting: true, transcript: "" },
};
