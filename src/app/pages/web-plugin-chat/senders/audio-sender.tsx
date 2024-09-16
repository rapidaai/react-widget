import { FC, HTMLAttributes, useContext } from "react";
import { useMessageAudioStream } from "@/app/pages/web-plugin-chat/hooks/use-message-audio-stream";
import { DotLoader } from "@/app/components/loaders/dot-loader";
import { toTitleCase } from "@/utils";
import { cn } from "@/styles/media";
import { SpeakLoader } from "@/app/components/loaders/speak-loader";
import { MicLoader } from "@/app/components/loaders/mic-loader";
import { toContentText } from "@/utils/rapida_content";
import { SenderProps } from "@/app/pages/web-plugin-chat/senders/sender";
import { useAssistantChatContext } from "@/contexts/assistant-chat-context";

/**
 * Props for audio sender
 */
// interface AudioSenderProps extends HTMLAttributes<HTMLFormElement> {
//   assistant: Assistant;
//   assistantConversationId?: string | null;
//   onCreateConversation: (msg: AssistantConversationMessage) => void;
// }

/**
 * AudioSender component
 * @param param0
 * @returns
 */
export const AudioSender: FC<SenderProps> = ({
  assistant,
  assistantConversationId,
  onMessaging,
  className,
  auth,
  onSend,
  //   onChangeInputType,
}) => {
  const { conversations, onChangeConversationMessages } =
    useAssistantChatContext();

  const {
    isRecording,
    stopRecording,
    notificationMessage,
    currentTranscribeContent,
    doingWhat,
  } = useMessageAudioStream({
    assistantId: assistant.getId(),
    assistantVersion: assistant.getAssistantprovidermodelid(),
    onMessaging: onMessaging,
    auth: auth,
    onSend: onSend,
  });

  return (
    <>
      {notificationMessage && (
        <div className="pks_border-0.5 pks_relative pks_px-3.5 pks_text-text-200 pks_border-blue-100/20 pks_bg-blue-600/10 dark:pks_bg-blue-600/20 pks_-mb-1 pks_rounded-t-xl pks_border-b-0 pks_pb-2.5 pks_pt-2">
          <div className="pks_font-normal pks_text-sm pks_w-full pks_flex pks_items-center pks_justify-between">
            <div className="pks_flex pks_items-center">
              <DotLoader />
              <span className="pks_font-semibold pks_ml-2">
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
              <span className="pks_ml-1">{notificationMessage}</span>
            </div>
            <div className="dark:pks_text-gray-400 pks_text-gray-600 pks_opacity-80">
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
                : "Rapida"}{" "}
              can make mistakes. Please double-check responses.
            </div>
          </div>
        </div>
      )}
      <div className="pks_flex pks_flex-col pks_items-center pks_relative pks_pb-4 pks_px-4 pks_z-10">
        <div
          className={cn(
            "pks_border-[1px] pks_border-gray-300 dark:pks_border-gray-600/50",
            "pks_shadow pks_flex pks_items-start pks_w-full pks_rounded-xl pks_p-2 pks_bg-gray-50 dark:pks_bg-slate-900",
            "pks_relative"
          )}
        >
          <button onClick={() => isRecording && stopRecording()}>
            {doingWhat === "speaking" && (
              <SpeakLoader isRecording={isRecording} />
            )}
            {doingWhat === "listening" && (
              <MicLoader isRecording={isRecording} />
            )}
          </button>

          <div className="pks_ml-2 pks_text-lg pks_font-medium pks_my-auto">
            {currentTranscribeContent.length > 0 ? (
              toContentText(currentTranscribeContent)
            ) : (
              <p className="pks_opacity-40">try saying hi....</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
