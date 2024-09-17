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
import { Button, HoverButton, IconButton } from "@/app/components/buttons";
import { ScalableTextarea } from "@/app/components/textareas";
import TooltipPlus from "@/app/components/tooltips";

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
              <span className="pks_ml-0.5">{notificationMessage}</span>
            </div>
            <div
              className={cn(
                "dark:pks_text-white/80 pks_text-gray-600 pks_truncate pks_opacity-60 pks_invisible",
                notificationType !== "error" && "pks_visible"
              )}
            >
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

      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className={cn(
          "pks_flex pks_flex-col pks_items-center pks_relative pks_z-10",
          className
        )}
      >
        <ScalableTextarea
          placeholder="How can i help you today?"
          spellCheck="false"
          wrapperClassName="pks_shadow !pks_rounded-xl"
          className={cn("pks_text-base !pks_rounded-xl", textAreaClassName)}
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
            <div className="pks_flex pks_shrink-0 pks_grow-0 pks_items-center pks_rounded-b-xl pks_px-2 pks_py-1 pks_border-t-[0.5px] dark:pks_border-gray-700">
              <div className="pks_flex-1 pks_flex pks_items-center pks_gap-1 pks_invisible">
                <TooltipPlus
                  popupContent={"Send a file"}
                  className="dark:!pks_bg-slate-700"
                >
                  <IconButton
                    type="button"
                    className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      className="pks_h-5 pks_w-5"
                      strokeWidth={2.2}
                    >
                      <path
                        d="M13.879 8.375l-5.486 5.486c-.826.826-.826 2.166 0 2.992v0c.826.826 2.166.826 2.992 0l7.232-7.232c1.515-1.515 1.515-3.971 0-5.486v0c-1.515-1.515-3.971-1.515-5.486 0l-7.232 7.232c-2.204 2.204-2.204 5.776 0 7.98v0c2.204 2.204 5.776 2.204 7.98 0l4.389-4.389"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        strokeLinejoin="round"
                      />
                      <path fill="none" d="M0 0h24v24h-24Z" />
                    </svg>
                  </IconButton>
                </TooltipPlus>
                <div className="pks_self-stretch pks_py-1.5">
                  <span
                    aria-orientation="vertical"
                    className="pks_flex pks_rounded-full pks_bg-gray-200 dark:pks_bg-gray-800 pks_w-px pks_h-full"
                    role="separator"
                  />
                </div>
                <TooltipPlus
                  popupContent={"Audio recording"}
                  className="dark:!bg-slate-700"
                >
                  <IconButton
                    type="button"
                    className={`pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600`}
                    onClick={() => {
                      if (onChangeInputType) onChangeInputType("audio");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.2}
                      stroke="currentColor"
                      className="pks_h-5 pks_w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                      />
                    </svg>
                  </IconButton>
                </TooltipPlus>
                <div className="pks_self-stretch pks_py-1.5">
                  <span
                    aria-orientation="vertical"
                    className="pks_flex pks_rounded-full pks_bg-gray-200 dark:pks_bg-gray-800 pks_w-px pks_h-full"
                    role="separator"
                  />
                </div>
                <IconButton
                  type="button"
                  className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600"
                >
                  <i className="pks_h-5 pks_w-5 pks_flex pks_justify-center">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="pks_w-full pks_h-full"
                    >
                      <path
                        d="M15.0868 7.16044V11.9855M7.8009 11.9976L4.36302 4L0.913086 11.9976M1.5283 10.5621H7.18573M14.3764 7.85887C15.3237 8.80621 15.3237 10.3422 14.3764 11.2895C13.429 12.2368 11.8931 12.2368 10.9457 11.2895C9.99839 10.3422 9.99839 8.80621 10.9457 7.85887C11.8931 6.91153 13.429 6.91153 14.3764 7.85887Z M0 15L16 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </i>
                </IconButton>
                <div className="pks_self-stretch pks_py-1.5">
                  <span
                    aria-orientation="vertical"
                    className="pks_flex pks_rounded-full pks_bg-gray-200 dark:pks_bg-gray-800 pks_w-px pks_h-full"
                    role="separator"
                  />
                </div>
                <IconButton
                  type="button"
                  className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600"
                >
                  <span>
                    <i className="pks_h-4 pks_w-4 pks_flex pks_justify-center">
                      <svg
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="pks_w-full pks_h-full"
                      >
                        <path
                          d="M5 5V6.33333M9 5V6.33333M9.33333 8.792C9.33333 8.792 8.458 9.66667 7 9.66667C5.54133 9.66667 4.66667 8.792 4.66667 8.792M1 7C1 3.686 3.686 1 7 1C10.314 1 13 3.686 13 7C13 10.314 10.314 13 7 13C3.686 13 1 10.314 1 7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </i>
                  </span>
                </IconButton>
              </div>
              {isValid ? (
                <Button className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit">
                  {loading || sending ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon
                      strokeWidth={1.6}
                      className="pks_text-white pks_h-5 pks_w-5"
                    />
                  )}
                </Button>
              ) : (
                <HoverButton
                  type="button"
                  className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit pks_text-gray-400 dark:pks_text-gray-600"
                >
                  {loading || sending ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon strokeWidth={2} className="pks_h-5 pks_w-5" />
                  )}
                </HoverButton>
              )}
            </div>
          }
        />
      </form>
    </>
  );
};
