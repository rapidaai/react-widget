import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { FC, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn, toHumanReadableRelativeDay } from "@/styles/media";
import { ChevronUpIcon } from "@/icons/chevron-up";
import { AssistantConversation } from "@/app/clients/protos/talk-api_pb";
import { useChatNavigation } from "@/app/pages/web-plugin-chat/hooks/use-navigate";

export const RecentConversation: FC<{
  conversations: AssistantConversation[];
}> = ({ conversations }) => {
  const { goToConversation } = useChatNavigation();
  return (
    <div className="pks_bg-white/80 dark:pks_bg-slate-800/50 pks_rounded-lg pks_border pks_backdrop-blur">
      <div className="pks_w-full pks_border-b pks_px-2 pks_py-2">
        <h1 className="pks_text-lg pks_font-medium pks_opacity-50">
          Recent Conversations
        </h1>
      </div>
      <div className="pks_flex pks_flex-col pks_divide-y">
        {conversations.map((x, idx) => {
          return (
            <MotionDiv
              className="last:pks_rounded-b-lg pks_flex-col hover:pks_shadow pks_relative pks_cursor-pointer pks_flex  pks_py-2 pks_px-3 pks_overflow-hidden  pks_group pks_w-full pks_bg-white hover:pks_bg-gray-50"
              key={idx}
              onClick={() => {
                goToConversation(x.getId());
              }}
            >
              <div className="pks_flex pks_w-full">
                <span className="pks_absolute pks_right-4 pks_flex pks_justify-center pks_w-auto pks_h-10 pks_opacity-70">
                  <ChevronUpIcon className="pks_rotate-90" strokeWidth={2} />
                </span>
                <span className="pks_relative pks_text-lg pks_mr-8 pks_text-gray-500 pks_font-normal">
                  {x.getName()}
                </span>
              </div>
              <div className="pks_text-base pks_opacity-60 pks_flex">
                {x.getCreateddate() &&
                  toHumanReadableRelativeDay(x.getCreateddate()!)}
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </div>
  );
};

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {}
export const MotionDiv: FC<MotionDivProps> = ({
  className,
  children,
  ...alts
}) => {
  return (
    <motion.div
      variants={{
        initial: {
          scale: 0.5,
          y: 50,
          opacity: 0,
        },
        animate: {
          scale: 1,
          y: 0,
          opacity: 1,
        },
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      className={cn(
        "col-span-4 rounded-xl backdrop-blur-lg bg-gray-200/20 dark:bg-slate-800/20 p-6",
        className
      )}
      onClick={alts.onClick}
    >
      {children}
    </motion.div>
  );
};
