import { VoiceTranscriptDisplay } from "./VoiceTranscriptDisplay";

export default {
  title: "Audio/VoiceTranscriptDisplay",
  component: VoiceTranscriptDisplay,
};

export const Transcript = {
  args: { transcript: "What is the weather today?", isConnecting: false },
};
export const Listening = { args: { transcript: "", isConnecting: false } };
