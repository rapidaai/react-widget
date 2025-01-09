import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { cn, daysAgoFromTimestamp, getTimeFromDate } from "@/styles/media";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import {
  AssistantConversation,
  AssistantConversationMessage,
} from "@/app/clients/protos/common_pb";
import { GetAllAssistantConversationResponse } from "@/app/clients/protos/talk-api_pb";
import { GetAllAssistantConversation } from "@/app/clients/talk";
import { useEnvironment } from "@/hooks/use-environment";
import { HEADER_API_KEY } from "@/configs";
import { Sender } from "@/app/pages/web-plugin-chat/senders/sender";
import { ServiceError } from "@/app/clients/protos/web-api_pb_service";
import { HEADER_AUTH_ID } from "@/utils/rapida_header";
import { SuggestedQuestion } from "@/app/components/suggested-question";
import { RecentConversation } from "@/app/components/recent-conversation";
import { useChatNavigation } from "@/app/pages/web-plugin-chat/hooks/use-navigate";
import { Spinner } from "@/app/components/loaders/spinner";
import { useAssistantChatContext } from "@/contexts/assistant-chat-context";
import { AnimatedTabs } from "@/app/components/animated-tabs";
import { RapidaIcon } from "@/icons/rapida";
import useLanguageLabel from "@/hooks/use-language";

export const WelcomePage: FC<{
  currentAssistant: Assistant | null;
}> = memo(({ currentAssistant }) => {
  const { token, user } = useEnvironment();
  if (currentAssistant && token && user.user_id)
    return (
      <AssistantPage assistant={currentAssistant} token={token} user={user} />
    );
  return (
    <div>
      <Spinner />
    </div>
  );
});

const AssistantPage: FC<{
  assistant: Assistant;
  token: string;
  user: { user_id: string };
}> = ({ assistant, token, user }) => {
  const [conversactions, setConversations] = useState<AssistantConversation[]>(
    []
  );

  const { goToConversation } = useChatNavigation();
  const afterGetAllConversation = useCallback(
    (
      err: ServiceError | null,
      uvcr: GetAllAssistantConversationResponse | null
    ) => {
      if (uvcr && uvcr.getDataList()) setConversations(uvcr.getDataList());
    },
    []
  );

  const onGetAllConversation = (_token: string, _assistantId: string) => {
    GetAllAssistantConversation(
      _assistantId,
      1,
      20,
      [],
      afterGetAllConversation,
      {
        [HEADER_API_KEY]: _token,
        [HEADER_AUTH_ID]: user.user_id,
      }
    );
  };

  const ctx = useAssistantChatContext();
  useEffect(() => {
    onGetAllConversation(token, assistant.getId());
  }, [assistant]);

  //   const {} = useLanguageLabel();
  useEffect(() => {
    ctx.clear();
  }, []);
  return (
    <>
      <div
        className={cn(
          "pks_flex-1 pks_overflow-y-auto pks_flex-grow message-container pks_space-y-2 pks_pb-4"
        )}
      >
        <div className={cn("pks_p-3 pks_px-8 pks_flex pks_flex-col")}>
          <div className={cn("pks_h-16 pks_w-16 pks_my-[32px]")}>
            <img
              className="pks_w-full pks_h-full pks_object-cover pks_rounded-xl pks_border-[0.5px] pks_p-1 pks_bg-gray-100/50 dark:pks_border-gray-700 dark:pks_bg-gray-700/50"
              alt="Assistant Icon"
              src={assistant
                ?.getWebappearance()
                ?.getFieldsMap()
                ?.get("appIcon")
                ?.getStringValue()}
            />
          </div>
          <div className="pks_flex pks_flex-col pks_text-2xl pks_font-semibold pks_space-y-1">
            <h1 className="pks_text-[26px]">{useLanguageLabel("welcome")}</h1>
            <h1 className="pks_text-[26px]">
              {useLanguageLabel("how_can_i_help")}
              {/* {assistant
                ?.getWebappearance()
                ?.getFieldsMap()
                ?.get("openingStatement")
                ?.getStringValue()} */}
            </h1>
          </div>
        </div>
        <div className="pks_px-3 pks_pt-4">
          <SuggestedQuestion assistant={assistant} />
        </div>
      </div>
      <div className="pks_mx-2.5 pks_mt-2.5">
        <Sender
          assistant={assistant}
          onMessaging={(msg: AssistantConversationMessage) => {
            ctx.onChangeConversationMessages([msg]);
            goToConversation(msg.getAssistantconversationid());
          }}
          onSend={ctx.onSend}
          auth={{
            [HEADER_API_KEY]: token,
            [HEADER_AUTH_ID]: user.user_id,
          }}
        />
        <div className="pks_w-full pks_flex pks_items-center pks_justify-center pks_py-2 pks_text-xs">
          <span className="pks_opacity-60">Powered by</span>
          <RapidaIcon className="pks_w-[0.9rem] pks_h-[0.9rem] pks_text-blue-500 pks_opacity-90 pks_ml-1 pks_mr-0.5" />
          <a
            className="pks_font-semibold pks_text-blue-500 hover:pks_underline"
            target="_blank"
            href="https://rapida.ai"
          >
            rapida
          </a>
        </div>
      </div>
    </>
  );
};
