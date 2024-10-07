import {
  AssistantConversationMessage,
  AssistantMessageStage,
  Message,
} from "@/app/clients/protos/common_pb";
import { FC } from "react";
import { RapidaIcon } from "@/icons/rapida";
import { cn } from "@/styles/media";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import MarkdownRenderer from "@/app/components/markdown-renderer";
import { useEnvironment } from "@/hooks/use-environment";
import { DislikeButton } from "@/app/components/buttons/dislike-button";
import { LikeButton } from "@/app/components/buttons/like-button";
import { CopyButton } from "@/app/components/buttons/copy-button";
import { toContentText } from "@/utils/rapida_content";

/**
 *
 * @param param0
 * @returns
 */
export const UserChatMessage: FC<{ message: Message; time?: string }> = ({
  message,
}) => {
  /**
   * current user
   */
  return (
    <div
      className={cn("pks_flex pks_px-2 pks_py-3 pks_w-full pks_justify-start")}
    >
      <div className="pks_ml-2 pks_min-w-0">
        <div className="pks_border pks_opacity-80 pks_mr-2 pks_py-3 pks_px-4 pks_rounded-[18px] pks_bg-gray-100">
          <MarkdownRenderer>
            {toContentText(message.getContentsList())}
          </MarkdownRenderer>
        </div>
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
    <div className="pks_flex pks_px-2 pks_group pks_justify-end pks_items-start pks_gap-2">
      <div className="pks_h-12 pks_w-12 pks_flex-shrink-0 pks_flex pks_items-center pks_justify-center pks_bg-gray-100/50 pks_order-2 pks_border-[0.5px] pks_rounded-full">
        {assistant?.getWebappearance()?.getFieldsMap().get("appIcon") ? (
          <img
            className="pks_w-full pks_h-full pks_object-cover pks_rounded-full pks_p-2"
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
      <div className="pks_ml-2 pks_min-w-0 pks_order-1">
        {/* <div className="pks_relative pks_border pks_mr-2 pks_py-3 pks_px-4 pks_bg-zinc-100 dark:pks_bg-zinc-800 pks_rounded-br-3xl pks_rounded-tl-3xl pks_rounded-bl-xl dark:pks_border-zinc-700"> */}
        <div className="pks_border pks_rounded-[18px]">
          <div className="pks_opacity-80 pks_mr-2 pks_px-3 pks_pt-3 ">
            <MarkdownRenderer>
              {toContentText(messageContent.getContentsList())}
            </MarkdownRenderer>
          </div>

          <div className="pks_flex pks_w-full pks_py-2 pks_px-4 pks_space-x-1 pks_mt-3 pks_bg-gray-200/20 pks_rounded-b-[18px] pks_justify-end pks_border-t-[0.5px]">
            <CopyButton
              iconClassName="!pks_h-3.5 !pks_w-3.5"
              className="!pks_border-[0.5px] !pks_h-fit !pks_p-1 !pks_px-2 pks_text-gray-600  hover:!pks_bg-white dark:hover:!pks_bg-gray-800/50 !pks_rounded-md"
              withLabel={true}
            >
              {toContentText(messageContent.getContentsList())}
            </CopyButton>
            <LikeButton
              onClick={() => {
                messageActions.onLikeMessage(
                  assistantConversationMessage.getId()
                );
              }}
              withLabel={true}
              iconClassName="!pks_h-3.5 !pks_w-3.5"
              className="!pks_h-fit !pks_p-1 !pks_px-2 pks_text-green-600  hover:!pks_bg-white dark:hover:!pks_bg-green-800/50 !pks_border-[0.5px] !pks_rounded-md"
            />
            <DislikeButton
              onClick={() => {
                messageActions.onDislikeMessage(
                  assistantConversationMessage.getId()
                );
              }}
              withLabel={true}
              iconClassName="!pks_h-3.5 !pks_w-3.5"
              className="!pks_h-fit !pks_p-1 !pks_px-2 pks_text-rose-600  hover:!pks_bg-white dark:hover:!pks_bg-rose-800/50 !pks_border-[0.5px] !pks_rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
