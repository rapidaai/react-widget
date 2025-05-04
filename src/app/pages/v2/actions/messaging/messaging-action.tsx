import { FC, HTMLAttributes } from "react";
import {
  Channel,
  useInputModeToggleAgent,
  useEnsureVoiceAgent,
} from "rapida-react";
import { cn } from "@/styles/media";
import { AudioMessagingAction } from "./audio-messsaging-action";
import { SimpleMessagingAction } from "./simple-messaging-action";
import { RapidaIcon } from "@/icons/rapida";

/**
 *
 */
interface MessageActionProps extends HTMLAttributes<HTMLDivElement> {
  suggestions?: string[];
  placeholder?: string;
}

/**
 *
 * @param param0
 * @returns
 */
export const MessagingAction: FC<MessageActionProps> = ({
  suggestions = [],
  className,
  ...attr
}) => {
  const ctx = useEnsureVoiceAgent();
  const { channel } = useInputModeToggleAgent();

  return (
    <div className={cn(className)}>
      {channel === Channel.Audio ? (
        <AudioMessagingAction {...attr} />
      ) : (
        <SimpleMessagingAction {...attr} />
      )}
      <div className="pks_w-full pks_flex pks_items-center pks_justify-end pks_p-2 pks_text-[11.6px] pks_opacity-60">
        <span className="">We run on</span>
        <RapidaIcon className="pks_w-[0.9rem] pks_h-[0.9rem] pks_opacity-90 pks_ml-1 pks_mr-0.5" />
        <a
          className="hover:pks_underline"
          target="_blank"
          href="https://rapida.ai"
        >
          rapida
        </a>
      </div>
    </div>
  );
};
