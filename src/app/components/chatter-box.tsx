import { AssistantChatContext } from "@/app/hooks/use-assistant-chat";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import {
  cn,
  daysAgoFromTimestamp,
  getTimeFromDate,
  toHumanReadableRelativeDay,
} from "@/app/styles/media";
import { FC, memo, useContext, useEffect, useRef, useState } from "react";
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

/**
 *
 * @param param0
 * @returns
 */
export const ChatterBox: FC<{
  className?: string;
  onClose: () => void;
  assistant: Assistant;
}> = ({ onClose, className, assistant }) => {
  /**
   *
   */
  const {
    currentAssistantConversactionId,
    onChangeAssistantConversactionId,
    onChangeConversactionMessages,
    conversactions,
    onGetConversactionMessages,
  } = useContext(AssistantChatContext);

  const ctrRef = useRef<HTMLDivElement>(null);
  //
  //
  useEffect(() => {
    if (currentAssistantConversactionId) {
      onGetConversactionMessages(
        assistant.getId(),
        currentAssistantConversactionId,
        "2021822986910171136",
        "61c814ba2a3868574e53860537bb4bc03a9bd1305a822800d5f0ee0c1206ac5c",
        "2021822161534058496",
        (err) => {
          //   hideLoader();
        },
        (message) => {
          onChangeConversactionMessages(message);
          scrollTo(ctrRef);
        }
      );
    }
  }, [currentAssistantConversactionId]);

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
  const { onSend } = useContext(AssistantChatContext);
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
  const onSendingMessage = (message: Message) => {
    if (loading) return;
    setLoading(true);
    setNotificationMessage("is thinking...");
    const stream = onSend(
      assistant.getId(),
      assistant.getAssistantprovidermodelid(),
      currentAssistantConversactionId ? currentAssistantConversactionId : null,
      message,
      "2021822986910171136",
      "61c814ba2a3868574e53860537bb4bc03a9bd1305a822800d5f0ee0c1206ac5c",
      "2021822161534058496"
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
        setNotificationMessage(notificationStageMessage(convo.getStagesList()));
        onChangeConversactionMessages([...conversactions, convo]); // Update state with new conversation
        if (!currentAssistantConversactionId)
          onChangeAssistantConversactionId(convo.getAssistantconversactionid());
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
  };

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
          <header className="dark:bg-slate-900 p-3 rounded-t-lg border-b dark:border-gray-700 flex justify-between items-center">
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
      />
    </>
  );
};

const ChatInterface: FC<{
  assistant: Assistant;
  onSubmitQuickNote: (s: string) => void;
}> = memo(({ assistant, onSubmitQuickNote }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pt-8 flex flex-col space-y-4">
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
        <div className="flex flex-col space-y-2 px-6 text-base">
          <div className="opacity-70 -mx-2">Quick Suggestions</div>
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
                    "shadow w-full cursor-pointer py-2 px-3 border dark:bg-slate-700 rounded-full rounded-bl-none border-gray-600/30 opacity-80 dark:border-slate-800/50 bg-white",
                    "transform hover:scale-105 transition-transform duration-300 ease-in-out text-start"
                  )}
                  key={idx}
                  onClick={() => onSubmitQuickNote(x.getStringValue())}
                >
                  <p>{x.getStringValue()}</p>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
});
