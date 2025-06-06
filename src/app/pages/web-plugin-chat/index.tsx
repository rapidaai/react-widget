import { FC, useMemo } from "react";

import { useAgentDeployment } from "rapida-react";
import { ChatComponent } from "@/app/pages/v3";

export const WebPluginChat: FC<{}> = () => {
  const { deployment, assistant } = useAgentDeployment();

  if (deployment && assistant && deployment.type === "web-plugin") {
    // return <PluginRouter deployment={deployment.deployment!} />;
    return <ChatComponent deployment={deployment.deployment!} />;
  }
  return <></>; // or return an error message for incorrect deployment type
};
