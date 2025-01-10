import {
  AssistantConversationMessage,
  AssistantMessageStage,
  Message,
} from "@/app/clients/protos/common_pb";
import { FC } from "react";
import { RapidaIcon } from "@/icons/rapida";
import { cn, toHumanReadableRelativeTime } from "@/styles/media";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import MarkdownRenderer from "@/app/components/markdown-renderer";
import { useEnvironment } from "@/hooks/use-environment";
import { DislikeButton } from "@/app/components/buttons/dislike-button";
import { LikeButton } from "@/app/components/buttons/like-button";
import { CopyButton } from "@/app/components/buttons/copy-button";
import { toContentText } from "@/utils/rapida_content";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

/**
 *
 * @param param0
 * @returns
 */
export const UserChatMessage: FC<{
  messageContent: Message;
  time?: string;
}> = ({ messageContent, time }) => {
  /**
   * current user
   */
  return (
    <div className="pks_flex pks_items-end pks_justify-end pks_gap-2.5 pks_px-4">
      <div className="pks_flex pks_flex-col pks_w-fit pks_max-w-[320px] pks_leading-1.5 pks_p-2.5 pks_px-3 pks_border-gray-200 pks_bg-gray-100 pks_rounded-s-xl  pks_rounded-ee-xl pks_rounded-ss-xl dark:pks_bg-gray-700">
        <MarkdownRenderer>
          {toContentText(messageContent.getContentsList())}
        </MarkdownRenderer>
      </div>
    </div>
  );
};

/**
 *
 * @param param0
 * @returns
 */
export const SystemChatMessage: FC<{
  assistant: Assistant;
  assistantConversationId: string;
  assistantConversationMessage: AssistantConversationMessage;
  messageContent: Message;
  time?: string;
  stages: Array<AssistantMessageStage>;
  messageActions: {
    onLikeMessage: (messageId: string) => void;
    onDislikeMessage: (messageId: string) => void;
  };
}> = ({
  assistant,
  assistantConversationId,
  assistantConversationMessage,
  messageContent,
  time,
  stages,
  messageActions,
}) => {
  return (
    <div className="pks_flex pks_items-start pks_gap-2.5 pks_px-4">
      <div className="pks_w-[40px] pks_h-[40px] pks_rounded-full">
        {assistant?.getWebappearance()?.getFieldsMap().get("appIcon") ? (
          <img
            className="pks_w-full pks_h-full pks_object-cover pks_rounded-full"
            alt="Assistant Icon"
            src={assistant
              ?.getWebappearance()
              ?.getFieldsMap()
              .get("appIcon")
              ?.getStringValue()}
          />
        ) : (
          <RapidaIcon className="pks_h-8 pks_w-8 pks_rounded-full" />
        )}
      </div>
      <div className="pks_flex pks_flex-col pks_gap-1 pks_w-full pks_max-w-[320px] pks_group pks_relative">
        <div className="pks_flex pks_items-center pks_space-x-2 rtl:pks_space-x-reverse">
          <div className="pks_flex pks_space-x-1">
            <span className="pks_text-sm pks_font-semibold pks_text-gray-900 dark:pks_text-white">
              {assistant
                .getWebappearance()
                ?.getFieldsMap()
                .get("assistantName")
                ?.getStringValue()
                ? toTitleCase(
                    assistant
                      .getWebappearance()
                      ?.getFieldsMap()
                      .get("assistantName")
                      ?.getStringValue()
                  )
                : "Rapida"}
            </span>
            <span className="pks_text-sm pks_font-normal pks_text-gray-500 dark:pks_text-gray-400">
              {time}
            </span>
          </div>
          <AnimatePresence>
            <motion.div
              layout
              className="pks_absolute pks_top-0 pks_right-0 pks_flex"
            >
              <LikeButton
                onClick={() => {
                  messageActions.onLikeMessage(
                    assistantConversationMessage.getId()
                  );
                }}
                withLabel={false}
                iconClassName="!pks_h-3.5 !pks_w-3.5"
                className="!pks_bg-none !pks_h-fit !pks_p-1 !pks_px-2 pks_text-green-600  hover:!pks_bg-white dark:hover:!pks_bg-green-800/50 !pks_border-none"
              />
              <DislikeButton
                onClick={() => {
                  messageActions.onDislikeMessage(
                    assistantConversationMessage.getId()
                  );
                }}
                withLabel={false}
                iconClassName="!pks_h-3.5 !pks_w-3.5"
                className="!pks_bg-none !pks_h-fit !pks_p-1 !pks_px-2 pks_text-rose-600  hover:!pks_bg-white dark:hover:!pks_bg-rose-800/50 !pks_border-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pks_flex pks_flex-col pks_leading-1.5 pks_p-4 pks_border-gray-200 pks_bg-gray-100 pks_rounded-e-xl pks_rounded-es-xl dark:pks_bg-gray-700">
          <div className="pks_text-sm pks_font-normal pks_text-gray-900 dark:pks_text-white">
            <MarkdownRenderer>
              {toContentText(messageContent.getContentsList())}
            </MarkdownRenderer>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useRef, useState } from "react";
import { toTitleCase } from "@/utils";

interface ExpandableTagProps {
  unhoveredText: string;
  hoveredText: string;
}

function ExpandableTag({ unhoveredText, hoveredText }: ExpandableTagProps) {
  const width = useRef<number>(0); // Use a number type for width ref
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <LayoutGroup>
      <motion.div
        className="inline-block"
        style={{ minWidth: width.current }}
        onHoverStart={() => {
          if (!isHovering && ref.current) {
            width.current = ref.current.offsetWidth; // Ensure ref.current is not null
          }
          setIsHovering(true);
        }}
        onHoverEnd={() => setIsHovering(false)}
      >
        <motion.div
          ref={ref}
          layout
          className="inline-block relative text-gray-300 bg-gray-900 ring-1 ring-gray-800 px-4 py-1.5 tracking-wider text-sm font-medium whitespace-nowrap"
          style={{ borderRadius: 8 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={isHovering ? "hovering" : "unhovering"}
            >
              {isHovering ? hoveredText : unhoveredText}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
