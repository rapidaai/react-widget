import { FC, useMemo } from "react";

import { useAgentDeployment } from "rapida-react";
import { PluginRouter } from "@/app/pages/web-plugin-chat/routes";

export const WebPluginChat: FC<{}> = () => {
  const { deployment, assistant } = useAgentDeployment();

  if (deployment && assistant && deployment.type === "web-plugin") {
    return <PluginRouter deployment={deployment.deployment!} />;
  }
  return <></>; // or return an error message for incorrect deployment type
};
