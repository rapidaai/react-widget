import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { cn, daysAgoFromTimestamp, getTimeFromDate } from "@/styles/media";
import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { AssistantConversationMessage } from "@/app/clients/protos/common_pb";
import {
  AssistantConversation,
  GetAllAssistantConversationResponse,
} from "@/app/clients/protos/talk-api_pb";
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

export const WelcomePage: FC<{
  currentAssistant: Assistant | null;
}> = memo(({ currentAssistant }) => {
  //   const ctx = useAssistantChatContext();
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

  useEffect(() => {
    ctx.clear();
  }, []);
  return (
    <>
      <div
        className={cn(
          "pks_flex-1 pks_overflow-y-auto pks_flex-grow message-container pks_space-y-4 pks_pb-4"
        )}
      >
        <div className={cn("pks_p-3 pks_flex pks_flex-col")}>
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
          <div className="pks_flex pks_flex-col pks_text-2xl pks_font-semibold">
            <h1 className="">Hello there.</h1>
            <h1 className="pks_opacity-60">
              {assistant
                ?.getAppappearance()
                ?.getFieldsMap()
                ?.get("openingStatement")
                ?.getStringValue()}
            </h1>
          </div>
        </div>

        <div className="pks_mx-3">
          <SuggestedQuestion assistant={assistant} />
        </div>
        {conversactions.length > 0 && (
          <div className="pks_mx-3">
            <RecentConversation conversations={conversactions} />
          </div>
        )}
      </div>
      <div className="pks_mx-2.5 pks_mb-2.5">
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
      </div>
    </>
  );
};
