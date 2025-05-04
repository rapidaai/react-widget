import { cn } from "@/styles/media";
import { FC } from "react";
import { MessagingAction } from "@/app/pages/v2/actions";
import { ConversationMessages } from "@/app/pages/v2/text";
import { AgentWebpluginDeployment } from "rapida-react";

export const V2: FC<{ deployment: AgentWebpluginDeployment }> = ({
  deployment,
}) => {
  return (
    <>
      <div className="pks_flex-1 pks_overflow-y-auto pks_bg-gray-100 pks_space-y-4 pks_pt-4">
        <ConversationMessages deployment={deployment} />
      </div>
      <MessagingAction
        className="message-action pks_bg-white pks_rounded-b-xl"
        placeholder="Compose your message..."
      />
    </>
  );
};
