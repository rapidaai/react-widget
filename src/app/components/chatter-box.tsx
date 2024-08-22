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
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SystemChatMessage,
  UserChatMessage,
} from "@/app/app/components/chat-message";
// import { useCredential, useRapidaStore } from "@/app/hooks";
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
  //
  //
  useEffect(() => {
    if (!token) return;
    if (currentAssistantConversactionId) {
      onGetConversactionMessages(
        assistant.getId(),
        currentAssistantConversactionId,
        token,
        (err) => {
          //   hideLoader();
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
   * @param message
   */

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

  //
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
  //
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
    [token, currentAssistantConversactionId, assistant]
  );

  /**
   *
   */
  return (
    <>
      {!currentAssistantConversactionId ? (
        <ChatInterface
          assistant={assistant}
          onSubmitQuickNote={onSubmitQuickNote}
        />
      ) : (
        <>
          <header className="dark:bg-slate-900 p-3 rounded-t-lg border-b dark:border-gray-700 flex justify-between items-center font-medium">
            Message
            <div className="flex space-x-2">
              <IconButton className="p-1 w-7 h-7" onClick={onClose}>
                <CloseIcon className="opacity-90" strokeWidth={2} />
              </IconButton>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto flex-grow message-container">
            {conversactions.map((x, idx) => {
              return (
                <div
                  key={idx}
                  className={cn(
                    "max-w-full",
                    x.getCreateddate() &&
                      `day-${daysAgoFromTimestamp(x.getCreateddate()!)}`
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
        <div className="flex space-x-1 opacity-80 text-gray-600 dark:text-gray-400 text-sm px-4">
          <DotLoader />
          <span className="font-semibold">
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
        className="px-3 py-2"
      />
      <div className="flex items-center justify-center text-sm pb-2 dark:bg-gray-900/50 rounded-b-lg">
        <span className="opacity-80">Powered by</span>
        <RapidaIcon className="text-blue-800 ml-1 w-4 h-4" />
        <a
          href="https://rapida.ai"
          target="_blank"
          className="opacity-80 font-medium hover:underline hover:text-blue-600 cursor-pointer ml-0.5"
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
    <div className="flex flex-col h-full space-y-6 flex-grow">
      <div className="p-3 pt-8 flex flex-col space-y-4">
        <div
          className={cn(
            "transition-opacity duration-100 ease-in-out h-12 w-12"
          )}
        >
          <img
            className="w-full h-full object-cover rounded-full"
            alt="Assistant Icon"
            src={assistant
              ?.getAppappearance()
              ?.getFieldsMap()
              ?.get("appIcon")
              ?.getStringValue()}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Hello there.</h1>
          <p className="text-lg opacity-70">
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
        <div className="flex flex-col space-y-2 text-base bg-gray-100 dark:bg-gray-800 border-[0.5px] border-gray-300 dark:border-gray-600 shadow mx-3 rounded-lg p-2">
          <div className="opacity-70 font-medium text-[14px]">
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
                    "group",
                    "w-full cursor-pointer py-2 px-3 border dark:bg-slate-700 rounded-lg opacity-80 dark:border-gray-600/50 bg-white",
                    "text-start flex justify-between text-[14px]"
                  )}
                  key={idx}
                  onClick={() => onSubmitQuickNote(x.getStringValue())}
                >
                  <p className="font-medium">{x.getStringValue()}</p>
                  <ChevronUpIcon className="rotate-90 group-hover:text-blue-600 group-hover:opacity-100" />
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
});
