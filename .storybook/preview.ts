import type { Preview } from "@storybook/react";
import "../src/components/audio/audio-controls/audio-controls.scss";
import "../src/styles/carbon.scss";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: "centered",
  },
};

export default preview;
