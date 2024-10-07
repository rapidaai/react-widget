import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { FC } from "react";
import { ChevronUpIcon } from "@/icons/chevron-up";
import { MotionDiv } from "@/app/components/recent-conversation";
import { useMessageTextStream } from "@/app/pages/web-plugin-chat/hooks/use-message-text-stream";
import { AssistantConversationMessage } from "@/app/clients/protos/common_pb";
import { HEADER_API_KEY } from "@/configs";
import { HEADER_AUTH_ID } from "@/utils/rapida_header";
import { useEnvironment } from "@/hooks/use-environment";
import { Spinner } from "@/app/components/loaders/spinner";
import { useChatNavigation } from "@/app/pages/web-plugin-chat/hooks/use-navigate";
import { useAssistantChatContext } from "@/contexts/assistant-chat-context";
import { useRapidaStore } from "../../hooks/use-rapida-store";

export const SuggestedQuestion: FC<{
  assistant: Assistant;
}> = ({ assistant }) => {
  /**
   *
   */
  const { goToConversation } = useChatNavigation();
  const { token, user } = useEnvironment();
  const { showLoader } = useRapidaStore();
  const ctx = useAssistantChatContext();
  const { sending, onSendingTextMessage } = useMessageTextStream({
    assistantId: assistant.getId(),
    assistantVersion: assistant.getAssistantprovidermodelid(),
    onMessaging: (message: AssistantConversationMessage) => {
      ctx.onChangeConversationMessages([message]);
      if (message.getAssistantconversationid()) {
        goToConversation(message.getAssistantconversationid());
      }
    },
    onSend: ctx.onSend,
    auth: {
      [HEADER_API_KEY]: token!,
      [HEADER_AUTH_ID]: user.user_id,
    },
  });
  return (
    <>
      {assistant
        .getWebappearance()
        ?.getFieldsMap()
        ?.get("suggestedQuestions")
        ?.getListValue()
        ?.getValuesList() && (
        <div className="pks_flex pks_flex-col pks_gap-2 pks_opacity-80 pks_px-2">
          {assistant
            .getWebappearance()
            ?.getFieldsMap()
            ?.get("suggestedQuestions")
            ?.getListValue()
            ?.getValuesList()
            .map((x, idx) => {
              return (
                <MotionDiv
                  className="hover:pks_shadow pks_relative pks_cursor-pointer pks_flex pks_items-center pks_py-2 pks_px-3 pks_overflow-hidden pks_text-lg pks_rounded-lg pks_group pks_w-full pks_bg-gray-300/20 hover:pks_bg-blue-600/10 hover:pks_text-blue-600"
                  key={idx}
                  onClick={() => {
                    onSendingTextMessage(x.getStringValue());
                    showLoader();
                  }}
                >
                  <span className="pks_absolute pks_right-0 pks_flex pks_items-center pks_justify-start pks_w-10 pks_h-10 pks_duration-300 pks_transform group-hover:pks_translate-x-full pks_translate-x-0 pks_ease pks_text-blue-600">
                    {sending ? (
                      <Spinner />
                    ) : (
                      <ChevronUpIcon
                        className="pks_rotate-45"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="pks_relative"> {x.getStringValue()}</span>
                </MotionDiv>
              );
            })}
        </div>
      )}
    </>
  );
};
