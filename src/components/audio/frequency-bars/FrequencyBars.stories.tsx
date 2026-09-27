import { FrequencyBars } from "./FrequencyBars";

export default {
  title: "Audio/FrequencyBars",
  component: FrequencyBars,
};

export const Active = {
  args: { frequencies: [[0.1], [0.4], [0.8], [0.5], [0.2]], isMuted: false },
};
export const Muted = {
  args: { frequencies: [[0.02], [0.02], [0.02], [0.02], [0.02]], isMuted: true },
};
