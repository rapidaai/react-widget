import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { cn, daysAgoFromTimestamp, getTimeFromDate } from "@/styles/media";
import {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SystemChatMessage,
  UserChatMessage,
} from "@/app/components/chat-message";
import { AssistantConversationMessage } from "@/app/clients/protos/common_pb";
import { useEnvironment } from "@/hooks/use-environment";
import { HEADER_API_KEY } from "@/configs";
import { useRapidaStore } from "@/hooks/use-rapida-store";
import { Sender } from "@/app/pages/web-plugin-chat/senders/sender";
import { HEADER_AUTH_ID } from "@/utils/rapida_header";
import { useParams } from "react-router-dom";
import { useAssistantChatContext } from "@/contexts/assistant-chat-context";
import { Spinner } from "@/app/components/loaders/spinner";
import { AnimatePresence, motion } from "framer-motion";
import { useMessageAction } from "@/app/pages/web-plugin-chat/hooks/use-message-action";

/**
 * Chatter box props
 */
interface ChatterBoxProps extends HTMLAttributes<HTMLDivElement> {
  assistant: Assistant;
  conversationId: string;
}
export const ChatPage: FC<{
  currentAssistant: Assistant | null;
}> = memo(({ currentAssistant }) => {
  const { token, user } = useEnvironment();
  const { conversationId } = useParams();

  if (currentAssistant && token && user.user_id && conversationId)
    return (
      <ChatterBox
        assistant={currentAssistant}
        conversationId={conversationId}
      />
    );
  return (
    <div>
      <Spinner />
    </div>
  );
});
/**
 *
 * @param param0
 * @returns
 */
const ChatterBox: FC<ChatterBoxProps> = ({ assistant, conversationId }) => {
  /**
   *
   */
  const {
    onChangeConversationMessages,
    onGetConversationMessages,
    conversations,
    onSend,
  } = useAssistantChatContext();

  const { token, user } = useEnvironment();
  const { loading, showLoader, hideLoader } = useRapidaStore();
  const ctrRef = useRef<HTMLDivElement>(null);

  //
  useEffect(() => {
    if (!token) return;
    if (conversationId) {
      showLoader();
      onGetConversationMessages(
        assistant.getId(),
        conversationId,
        {
          [HEADER_API_KEY]: token,
          [HEADER_AUTH_ID]: user.user_id,
        },
        (err) => {
          hideLoader();
        },
        (messages) => {
          hideLoader();
          onChangeConversationMessages(messages);
          scrollTo(ctrRef);
        }
      );
    }
  }, [conversationId, token]);

  const onNewMessage = (msg: AssistantConversationMessage) => {
    onChangeConversationMessages([...conversations, msg]);
    scrollTo(ctrRef);
  };

  /**
   *
   * @param ref
   */
  const scrollTo = (ref: any) => {
    setTimeout(
      () =>
        ref.current?.scrollIntoView({ inline: "center", behavior: "smooth" }),
      777
    );
  };
  const variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const messageAction = useMessageAction({
    assistantId: assistant.getId(),
    assistantConversationId: conversationId,
    auth: {
      [HEADER_API_KEY]: token!,
      [HEADER_AUTH_ID]: user.user_id,
    },
  });

  return (
    <AnimatePresence>
      {loading ? (
        <div className="pks_flex-1 pks_pb-4 pks_flex pks_justify-center pks_items-center">
          <Spinner size="md" />
        </div>
      ) : (
        <motion.ul
          variants={variants}
          className="pks_flex-1 pks_overflow-y-auto pks_flex-grow message-container pks_text-gray-600 dark:pks_text-gray-500 pks_pb-4"
        >
          {conversations.map((x, idx) => {
            return (
              <motion.li
                data-key={`conversation-chat-${x.getId()}`}
                key={`conversation-chat-${x.getId()}`}
                className={cn(
                  "pks_max-w-full",
                  x.getCreateddate() &&
                    `pks_day-${daysAgoFromTimestamp(x.getCreateddate()!)}`
                )}
                variants={{
                  open: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      y: { stiffness: 1000, velocity: -100 },
                    },
                  },
                  closed: {
                    y: 50,
                    opacity: 0,
                    transition: {
                      y: { stiffness: 1000 },
                    },
                  },
                }}
              >
                {x.getRequest() && (
                  <UserChatMessage
                    message={x.getRequest()!}
                    time={
                      x.getCreateddate() && getTimeFromDate(x.getCreateddate()!)
                    }
                  />
                )}
                {x.getResponse() && (
                  <SystemChatMessage
                    assistant={assistant}
                    assistantConversationId={conversationId!}
                    assistantConversationMessage={x}
                    messageActions={messageAction}
                    messageContent={x.getResponse()!}
                    time={
                      x.getCreateddate() && getTimeFromDate(x.getCreateddate()!)
                    }
                    stages={x.getStagesList()}
                  />
                )}
              </motion.li>
            );
          })}
          <div ref={ctrRef} />
        </motion.ul>
      )}
      <div className="pks_p-2 pks_bg-white dark:pks_bg-gray-950 pks_rounded-b-[26px]">
        <Sender
          assistant={assistant}
          assistantConversationId={conversationId}
          onMessaging={onNewMessage}
          onSend={onSend}
          auth={{
            [HEADER_API_KEY]: token!,
            [HEADER_AUTH_ID]: user.user_id,
          }}
        />
      </div>
    </AnimatePresence>
  );
};
