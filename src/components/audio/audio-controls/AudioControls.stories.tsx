import { Channel } from "@rapidaai/react";
import { AudioControls } from "./AudioControls";

export default {
  title: "Audio/AudioControls",
  component: AudioControls,
};

export const Voice = {
  args: {
    channel: Channel.Audio,
    voiceEnabled: true,
    hasText: false,
    disabled: false,
    isConnected: true,
    isConnecting: false,
    isMuted: false,
    frequencies: [[0.1], [0.4], [0.8], [0.5], [0.2]],
    transcript: "What is my account balance?",
    devices: [],
    activeDeviceId: "",
    onStartVoice: () => undefined,
    onToggleMute: () => undefined,
    onSwitchToText: () => undefined,
    onStop: () => undefined,
    onDeviceChange: () => undefined,
  },
};
