import { Message } from "@/app/clients/protos/common_pb";
import { FC, useContext, useState } from "react";
import { toContentText } from "@/app/utils";
import { CopyIcon } from "@/app/icons/copy";
import { RapidaIcon } from "@/app/icons/rapida";
import { IconButton } from "@/app/app/components/buttons";
import { cn } from "@/app/styles/media";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import {
  AssistantConversactionMessage,
  AssistantMessageStage,
  RAGStage,
} from "@/app/clients/protos/talk-api_pb";
import MarkdownRenderer from "@/app/app/components/markdown-renderer";

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

  //
  return (
    <div className="flex px-2 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-950/20 w-full">
      <div className="h-9 w-9 rounded-full flex-shrink-0 bg-zinc-200/80 dark:bg-zinc-800/80 border-[0.5px] flex items-center justify-center dark:border-gray-700">
        <span className="font-bold text-lg opacity-80">
          {"Prashant".charAt(0)}
        </span>
      </div>
      <div className="ml-2 min-w-0">
        <div className="-mt-2">
          <span className="font-semibold dark:text-white text-sm">
            {"Prashant"}
          </span>
          <span className="ml-1 text-xs text-gray-500">{time}</span>
        </div>

        <MarkdownRenderer>
          {toContentText(message.getContentsList().at(0))}
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
  assistantConversactionId: string;
  assistantConversactionMessage: AssistantConversactionMessage;
  messageContent: Message;
  time?: string;
  stages: Array<AssistantMessageStage>;
}> = ({
  assistant,
  assistantConversactionId,
  messageContent,
  time,
  stages,
}) => {
  return (
    <div className="flex px-2 py-3 mb-3 group hover:bg-gray-100/50 relative dark:hover:bg-gray-950/20">
      <div className="absolute -top-5 right-2 invisible group-hover:visible">
        <SystemMessageAction />
      </div>
      <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center dark:border-gray-700">
        {assistant?.getAppappearance()?.getFieldsMap().get("appIcon") ? (
          <img
            className="w-full h-full object-cover rounded-full"
            alt="Assistant Icon"
            src={assistant
              ?.getAppappearance()
              ?.getFieldsMap()
              .get("appIcon")
              ?.getStringValue()}
          />
        ) : (
          <RapidaIcon className="h-8 w-8 text-blue-600 rounded-full" />
        )}
      </div>
      <div className="ml-2 min-w-0">
        <div className="-mt-1.5">
          <span className="font-semibold dark:text-white capitalize text-sm">
            {assistant?.getAppappearance()?.getFieldsMap().get("assistantName")
              ? assistant
                  ?.getAppappearance()
                  ?.getFieldsMap()
                  .get("assistantName")
                  ?.getStringValue()
              : "Rapida"}
          </span>
          <span className="ml-1 text-xs text-gray-500">{time}</span>
        </div>
        <MarkdownRenderer>
          {toContentText(messageContent.getContentsList().at(0))}
        </MarkdownRenderer>
      </div>
    </div>
  );
};

export const SystemMessageAction: FC = () => {
  return (
    <div className="flex w-fit border shadow-md p-1 rounded-lg space-x-1 dark:bg-gray-950/50 dark:border-gray-800">
      <IconButton className="h-6 w-6 p-0 text-green-600">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
          />
        </svg>
      </IconButton>
      <IconButton className="h-6 w-6 p-0 text-rose-600">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
          />
        </svg>
      </IconButton>
    </div>
  );
};
