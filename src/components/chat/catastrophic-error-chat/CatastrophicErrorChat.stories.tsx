import { CatastrophicErrorChat } from "./CatastrophicErrorChat";

export default {
  title: "Chat/CatastrophicErrorChat",
  component: CatastrophicErrorChat,
  parameters: { layout: "fullscreen" },
};

export const ConnectionFailure = {
  args: {
    error:
      "We couldn't connect to the assistant. Check your connection and try again.",
    config: { layout: { mode: "inline" }, name: "Rapida Assistant" },
  },
};
