import { FC, useContext } from "react";
import { useRapidaStore } from "@/hooks/use-rapida-store";
import { useForm } from "react-hook-form";
import { toTitleCase } from "@/utils";
import { cn } from "@/styles/media";
import { Spinner } from "@/app/components/loaders/spinner";
import { UpArrowIcon } from "@/icons/up-arrow";
import { SenderProps } from "@/app/pages/web-plugin-chat/senders/sender";
import { useMessageTextStream } from "@/app/pages/web-plugin-chat/hooks/use-message-text-stream";
import { DotLoader } from "@/app/components/loaders/dot-loader";
import {
  BorderButton,
  Button,
  HoverButton,
  IconButton,
} from "@/app/components/buttons";
import { ScalableTextarea } from "@/app/components/textareas";
import TooltipPlus from "@/app/components/tooltips";
import useLanguageLabel from "@/hooks/use-language";

/**
 *
 *
 * for audio sender
 * @param param0
 * @returns
 */
export const TextSender: FC<SenderProps> = ({
  assistantConversationId,
  assistant,
  onMessaging,
  className,
  textAreaClassName,
  onChangeInputType,
  auth,
  onSend,
}) => {
  const {
    sending,
    notificationType,
    notificationMessage,
    onSendingTextMessage,
  } = useMessageTextStream({
    assistantId: assistant.getId(),
    assistantVersion: assistant.getAssistantprovidermodelid(),
    assistantConversationId: assistantConversationId,
    onMessaging: onMessaging,
    onSend: onSend,
    auth: auth,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const { loading } = useRapidaStore();
  //
  const onSubmitForm = (data: any) => {
    if (loading || sending) return;
    reset();
    onSendingTextMessage(data.message);
  };

  return (
    <>
      {notificationMessage && (
        <div
          className={cn(
            "pks_mx-2 pks_border-0.5 pks_relative pks_px-2 pks_-mb-1 pks_rounded-t-xl pks_border-b-0 pks_pb-2.5 pks_pt-2 dark:pks_text-white/60",
            notificationType !== "error"
              ? "pks_border-blue-100/20 pks_bg-blue-600/10 dark:pks_bg-blue-600/20"
              : "pks_border-red-100/20 pks_bg-red-600/10 dark:pks_bg-red-600/20  !pks_text-red-600 dark:!pks_text-red-600"
          )}
        >
          <div className="pks_font-normal pks_text-sm pks_w-full pks_flex pks_items-center pks_justify-between">
            <div className="pks_flex pks_items-center pks_shrink-0 pks_mr-8">
              {notificationType !== "error" && <DotLoader />}
              <span className="pks_font-semibold pks_ml-1.5">
                {assistant
                  .getWebappearance()
                  ?.getFieldsMap()
                  .get("assistantName")
                  ?.getStringValue()
                  ? toTitleCase(
                      assistant
                        .getWebappearance()
                        ?.getFieldsMap()
                        .get("assistantName")
                        ?.getStringValue()
                    )
                  : "Rapida"}
              </span>
              <span className="pks_ml-0.5">{notificationMessage}</span>
            </div>
            <div
              className={cn(
                "dark:pks_text-white/80 pks_text-gray-600 pks_truncate pks_opacity-60 pks_invisible",
                notificationType !== "error" && "pks_visible"
              )}
            >
              {assistant
                .getWebappearance()
                ?.getFieldsMap()
                .get("assistantName")
                ?.getStringValue()
                ? toTitleCase(
                    assistant
                      .getWebappearance()
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

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className={cn(
          "pks_flex pks_flex-col pks_items-center pks_relative pks_z-10",
          className
        )}
      >
        <ScalableTextarea
          placeholder={useLanguageLabel("chat_input_placeholder")}
          spellCheck="false"
          wrapperClassName="!pks_rounded-[26px] pks_shadow"
          className={cn("pks_text-base !pks_rounded-[26px]", textAreaClassName)}
          {...register("message", {
            required: "Please write your message.",
          })}
          required
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(onSubmitForm)(e);
            }
          }}
          actions={
            <>
              {isValid ? (
                <Button className="pks_border-none pks_rounded-full !pks_p-1.5 pks_h-fit">
                  {loading || sending ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon
                      strokeWidth={2}
                      className="pks_text-white pks_h-6 pks_w-6"
                    />
                  )}
                </Button>
              ) : (
                <BorderButton
                  type="button"
                  className="pks_rounded-full !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600 !pks_border-[0.5px] pks_shadow-sm !pks_bg-white"
                >
                  {loading || sending ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon
                      strokeWidth={2}
                      className="pks_h-6 pks_w-6 pks_rotate-90 pks_opacity-70"
                    />
                  )}
                </BorderButton>
              )}
            </>
          }
        />
      </form>
    </>
  );
};
