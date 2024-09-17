import {
  AssistantConversationMessage,
  AssistantMessageStage,
  Message,
} from "@/app/clients/protos/common_pb";
import { FC, useContext, useState } from "react";
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
  time,
}) => {
  /**
   * current user
   */
  const { user } = useEnvironment();
  //
  return (
    <div
      className={cn("pks_flex pks_px-2 pks_py-3 pks_w-full pks_justify-start")}
    >
      {/* <div className="pks_h-9 pks_w-9 pks_rounded-full pks_flex-shrink-0 pks_bg-zinc-200/80 dark:pks_bg-zinc-800/80 pks_border-[0.5px] pks_flex pks_items-center pks_justify-center dark:pks_border-gray-700">
        <span className="pks_font-bold pks_text-lg pks_opacity-80">
          {user.name.charAt(0)}
        </span>
      </div> */}
      <div className="pks_ml-2 pks_min-w-0">
        {/* <div className="pks_-mt-2">
          <span className="pks_font-semibold dark:pks_text-white pks_text-lg">
            {user.name}
          </span>
          <span className="pks_ml-1 pks_text-sm pks_text-gray-500">{time}</span>
        </div> */}

        <div className="pks_border pks_opacity-80 pks_mr-2 pks_py-3 pks_px-4 pks_bg-zinc-100 dark:pks_bg-zinc-700 dark:pks_border-zinc-600 pks_border-zinc-200 pks_rounded-br-3xl pks_rounded-tl-3xl pks_rounded-tr-xl ">
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
    <div className="pks_flex pks_px-2 pks_group pks_justify-end pks_items-start">
      <div className="pks_h-9 pks_w-9 pks_flex-shrink-0 pks_flex pks_items-center pks_justify-center dark:pks_border-gray-700 pks_order-2">
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
          <RapidaIcon className="pks_h-8 pks_w-8 pks_text-blue-600 pks_rounded-full" />
        )}
      </div>
      <div className="pks_ml-2 pks_min-w-0 pks_order-1">
        <div className="pks_relative pks_border pks_mr-2 pks_py-3 pks_px-4 pks_bg-zinc-100 dark:pks_bg-zinc-800 pks_rounded-br-3xl pks_rounded-tl-3xl pks_rounded-bl-xl dark:pks_border-zinc-700">
          <div className="pks_absolute pks_-top-5 pks_right-2 pks_invisible group-hover:pks_visible">
            <div className="pks_flex pks_w-fit pks_border pks_shadow-md pks_p-0.5 pks_rounded-lg pks_space-x-1 dark:pks_bg-gray-950/50 dark:pks_border-gray-800 pks_bg-white pks_backdrop-blur">
              <CopyButton
                iconClassName="!pks_h-3.5 !pks_w-3.5"
                className="!pks_h-fit !pks_p-1 pks_text-gray-600  hover:!pks_bg-gray-400/50 dark:hover:!pks_bg-gray-800/50 !pks_border-none !pks_rounded-md"
              >
                {toContentText(messageContent.getContentsList())}
              </CopyButton>
              <LikeButton
                onClick={() => {
                  messageActions.onLikeMessage(
                    assistantConversationMessage.getId()
                  );
                }}
                iconClassName="!pks_h-3.5 !pks_w-3.5"
                className="!pks_h-fit !pks_p-1 pks_text-green-600  hover:!pks_bg-green-400/50 dark:hover:!pks_bg-green-800/50 !pks_border-none !pks_rounded-md"
              />
              <DislikeButton
                onClick={() => {
                  messageActions.onDislikeMessage(
                    assistantConversationMessage.getId()
                  );
                }}
                iconClassName="!pks_h-3.5 !pks_w-3.5"
                className="!pks_h-fit !pks_p-1 pks_text-rose-600  hover:!pks_bg-rose-400/50 dark:hover:!pks_bg-rose-800/50 !pks_border-none !pks_rounded-md"
              />
            </div>
          </div>
          <MarkdownRenderer>
            {toContentText(messageContent.getContentsList())}
          </MarkdownRenderer>
        </div>
      </div>
    </div>
  );
};
