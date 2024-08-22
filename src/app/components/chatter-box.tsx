import { useAssistantChat } from "@/app/hooks/use-assistant-chat";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import {
  cn,
  daysAgoFromTimestamp,
  getTimeFromDate,
  toHumanReadableRelativeDay,
} from "@/app/styles/media";
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
} from "@/app/app/components/chat-message";
import { ChatFooter } from "@/app/app/components/chat-footer";
import { IconButton } from "@/app/app/components/buttons";
import { CloseIcon } from "@/app/icons/close";
import { toTextContent, toTitleCase } from "@/app/utils";
import { Message } from "@/app/clients/protos/common_pb";
import { DotLoader } from "@/app/app/components/loaders/dot-loader";
import {
  AssistantMessageStage,
  CreateAssistantMessageResponse,
} from "@/app/clients/protos/talk-api_pb";
import * as grpcWeb from "grpc-web";
import { GetStageMessage } from "@/app/clients/talk";
import { ChevronDownIcon } from "@/app/icons/chevron-down";
import { ChevronUpIcon } from "@/app/icons/chevron-up";
import { RapidaIcon } from "@/app/icons/rapida";
import { useEnvironment } from "@/app/hooks/use-environment";

/**
 * Chatter box props
 */
interface ChatterBoxProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  onClose: () => void;
  assistant: Assistant;
}

/**
 *
 * @param param0
 * @returns
 */
export const ChatterBox: FC<ChatterBoxProps> = ({
  onClose,
  className,
  assistant,
}) => {
  /**
   *
   */
  const {
    currentAssistantConversactionId,
    onChangeAssistantConversactionId,
    onChangeConversactionMessages,
    conversactions,
    onGetConversactionMessages,
  } = useAssistantChat();
  const { token } = useEnvironment();

  const ctrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    if (currentAssistantConversactionId) {
      onGetConversactionMessages(
        assistant.getId(),
        currentAssistantConversactionId,
        token,
        (err) => {
          // hideLoader();
        },
        (message) => {
          onChangeConversactionMessages(message);
          scrollTo(ctrRef);
        }
      );
    }
  }, [currentAssistantConversactionId, token]);

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

  const [loading, setLoading] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  /**
   *
   */
  const { onSend } = useAssistantChat();

  /**
   *
   * @param text
   * @returns
   */
  const createMessage = (data: string): Message => {
    const msg = new Message();
    msg.setRole("user");
    msg.addContents(toTextContent(data));
    return msg;
  };

  const onSubmitQuickNote = (note: string) => {
    onSendingMessage(createMessage(note));
  };

  const onSendingMessage = useCallback(
    (message: Message) => {
      if (!token) return;
      if (loading) return;
      setLoading(true);
      setNotificationMessage("is thinking...");
      const stream = onSend(
        assistant.getId(),
        assistant.getAssistantprovidermodelid(),
        currentAssistantConversactionId
          ? currentAssistantConversactionId
          : null,
        message,
        token
      );

      const notificationStageMessage = (
        stages: Array<AssistantMessageStage>
      ): string => {
        let stage = stages.at(stages.length - 1);
        if (stage) return GetStageMessage(stage.getStage());
        return "Please wait...";
      };

      stream.on("data", (response: CreateAssistantMessageResponse) => {
        const convo = response.getData();
        if (convo) {
          setNotificationMessage(
            notificationStageMessage(convo.getStagesList())
          );
          onChangeConversactionMessages([...conversactions, convo]); // Update state with new conversation
          if (!currentAssistantConversactionId)
            onChangeAssistantConversactionId(
              convo.getAssistantconversactionid()
            );
          scrollTo(ctrRef);
        }
      });

      stream.on("error", (err: grpcWeb.RpcError) => {
        setNotificationMessage("");
        setLoading(false);
      });

      stream.on("end", () => {
        setNotificationMessage("");
        setLoading(false);
        scrollTo(ctrRef);
      });
    },
    [
      token,
      currentAssistantConversactionId,
      assistant,
      loading,
      conversactions,
      onSend,
      onChangeConversactionMessages,
      onChangeAssistantConversactionId,
    ]
  );

  return (
    <>
      {!currentAssistantConversactionId ? (
        <ChatInterface
          assistant={assistant}
          onSubmitQuickNote={onSubmitQuickNote}
        />
      ) : (
        <>
          <header className="dark:pks_bg-slate-900 pks_p-3 pks_rounded-t-lg pks_border-b dark:pks_border-gray-700 pks_flex pks_justify-between pks_items-center pks_font-medium">
            Message
            <div className="pks_flex pks_space-x-2">
              <IconButton className="pks_p-1 pks_w-7 pks_h-7" onClick={onClose}>
                <CloseIcon className="pks_opacity-90" strokeWidth={2} />
              </IconButton>
            </div>
          </header>
          <div className="pks_flex-1 pks_overflow-y-auto pks_flex-grow message-container">
            {conversactions.map((x, idx) => {
              return (
                <div
                  key={idx}
                  className={cn(
                    "pks_max-w-full",
                    x.getCreateddate() &&
                      `pks_day-${daysAgoFromTimestamp(x.getCreateddate()!)}`
                  )}
                >
                  {x.getRequest() && (
                    <UserChatMessage
                      message={x.getRequest()!}
                      time={
                        x.getCreateddate() &&
                        getTimeFromDate(x.getCreateddate()!)
                      }
                    />
                  )}
                  {x.getResponse() && (
                    <SystemChatMessage
                      assistant={assistant}
                      assistantConversactionId={currentAssistantConversactionId}
                      assistantConversactionMessage={x}
                      messageContent={x.getResponse()!}
                      time={
                        x.getCreateddate() &&
                        getTimeFromDate(x.getCreateddate()!)
                      }
                      stages={x.getStagesList()}
                    />
                  )}
                </div>
              );
            })}
            <div ref={ctrRef} />
          </div>
        </>
      )}
      {notificationMessage && (
        <div className="pks_flex pks_space-x-1 pks_opacity-80 pks_text-gray-600 dark:pks_text-gray-400 pks_text-sm pks_px-4">
          <DotLoader />
          <span className="pks_font-semibold">
            {assistant
              .getAppappearance()
              ?.getFieldsMap()
              .get("assistantName")
              ?.getStringValue()
              ? toTitleCase(
                  assistant
                    .getAppappearance()
                    ?.getFieldsMap()
                    .get("assistantName")
                    ?.getStringValue()
                )
              : "Rapida"}
          </span>
          <span>{notificationMessage}</span>
        </div>
      )}
      <ChatFooter
        assistant={assistant}
        loading={loading}
        onSendingMessage={onSendingMessage}
        className="pks_px-3 pks_py-2"
      />
      <div className="pks_flex pks_items-center pks_justify-center pks_text-sm pks_pb-2 dark:pks_bg-gray-900/50 pks_rounded-b-lg">
        <span className="pks_opacity-80">Powered by</span>
        <RapidaIcon className="pks_text-blue-800 pks_ml-1 pks_w-4 pks_h-4" />
        <a
          href="https://rapida.ai"
          target="_blank"
          className="pks_opacity-80 pks_font-medium pks_hover:underline pks_hover:text-blue-600 pks_cursor-pointer pks_ml-0.5"
        >
          Rapida
        </a>
      </div>
    </>
  );
};

const ChatInterface: FC<{
  assistant: Assistant;
  onSubmitQuickNote: (s: string) => void;
}> = memo(({ assistant, onSubmitQuickNote }) => {
  return (
    <div className="pks_flex pks_flex-col pks_h-full pks_space-y-6 pks_flex-grow">
      <div className="pks_p-3 pks_pt-8 pks_flex pks_flex-col pks_space-y-4">
        <div
          className={cn(
            "pks_transition-opacity pks_duration-100 pks_ease-in-out pks_h-12 pks_w-12"
          )}
        >
          <img
            className="pks_w-full pks_h-full pks_object-cover pks_rounded-full"
            alt="Assistant Icon"
            src={assistant
              ?.getAppappearance()
              ?.getFieldsMap()
              ?.get("appIcon")
              ?.getStringValue()}
          />
        </div>
        <div className="pks_flex pks_flex-col">
          <h1 className="pks_text-xl pks_font-bold">Hello there.</h1>
          <p className="pks_text-lg pks_opacity-70">
            {assistant
              .getAppappearance()
              ?.getFieldsMap()
              ?.get("openingStatement")
              ?.getStringValue()}
          </p>
        </div>
      </div>

      {assistant
        .getAppappearance()
        ?.getFieldsMap()
        ?.get("suggestedQuestions")
        ?.getListValue() && (
        <div className="pks_flex pks_flex-col pks_space-y-2 pks_text-base pks_bg-gray-100 dark:pks_bg-gray-800 pks_border-[0.5px] pks_border-gray-300 dark:pks_border-gray-600 pks_shadow pks_mx-3 pks_rounded-lg pks_p-2">
          <div className="pks_opacity-70 pks_font-medium pks_text-[14px]">
            Quick Suggestions
          </div>
          {assistant
            .getAppappearance()
            ?.getFieldsMap()
            ?.get("suggestedQuestions")
            ?.getListValue()
            ?.getValuesList()
            .map((x, idx) => {
              return (
                <button
                  className={cn(
                    "pks_group",
                    "pks_w-full pks_cursor-pointer pks_py-2 pks_px-3 pks_border dark:pks_bg-slate-700 pks_rounded-lg pks_opacity-80 dark:pks_border-gray-600/50 pks_bg-white",
                    "pks_text-start pks_flex pks_justify-between pks_text-[14px]"
                  )}
                  key={idx}
                  onClick={() => onSubmitQuickNote(x.getStringValue())}
                >
                  <p className="pks_font-medium">{x.getStringValue()}</p>
                  <ChevronUpIcon className="pks_rotate-90 pks_group-hover:text-blue-600 pks_group-hover:opacity-100" />
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
});
