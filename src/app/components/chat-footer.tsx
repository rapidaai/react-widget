import { ScalableTextarea } from "@/app/components/textareas";
import { useForm } from "react-hook-form";
import { Button, HoverButton, IconButton } from "@/app/components/buttons";
import { UpArrowIcon } from "@/icons/up-arrow";
import { Spinner } from "@/app/components/loaders/spinner";
import { cn } from "@/styles/media";
import { FC, HTMLAttributes, useContext, useState } from "react";
import { Message } from "@/app/clients/protos/common_pb";
import { toTextContent, toTitleCase } from "@/utils";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
/**
 *
 */
interface ChatFooterProps extends HTMLAttributes<HTMLDivElement> {
  assistant: Assistant;
  loading: boolean;
  onSendingMessage: (msg: Message) => void;
}

/**
 *
 * @param param0
 * @returns
 */
export const ChatFooter: FC<ChatFooterProps> = ({
  assistant,
  loading,
  onSendingMessage,
  className,
}) => {
  /**
   *
   * @param data
   */
  //   const { loading, showLoader, hideLoader } = useRapidaStore();
  //   const [userId, token, projectId] = useCredential();

  const createMessage = (data: string): Message => {
    const msg = new Message();
    msg.setRole("user");
    msg.addContents(toTextContent(data));
    return msg;
  };

  //
  const onSubmitForm = (data: any) => {
    if (loading) return;
    reset();
    onSendingMessage(createMessage(data.message));
  };
  /**
   *
   */
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });
  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className={cn(
        "pks_flex pks_flex-col pks_items-center pks_relative",
        className
      )}
    >
      <ScalableTextarea
        placeholder="How can i help you today?"
        spellCheck="false"
        wrapperClassName="shadow"
        className="pks_text-[15px]"
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
          <div className="pks_flex pks_shrink-0 pks_grow-0 pks_items-center pks_rounded-b-lg pks_px-0.5">
            <div className="pks_flex-1 pks_flex pks_items-center pks_gap-1 pks_opacity-0">
              <IconButton
                type="button"
                className="pks_border-none rounded-lg !p-1.5 h-fit"
              >
                <i className="pks_h-5 w-5 flex justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="pks_w-full h-full"
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
                </i>
              </IconButton>
              <div className="pks_self-stretch py-1.5">
                <span
                  aria-orientation="vertical"
                  className="pks_flex rounded-full bg-gray-200 dark:bg-gray-800 w-px h-full"
                  role="separator"
                />
              </div>
              <IconButton
                type="button"
                className="pks_border-none rounded-lg !p-1.5 h-fit"
              >
                <i className="pks_h-5 w-5 flex justify-center">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pks_w-full h-full"
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
              <div className="pks_self-stretch py-1.5">
                <span
                  aria-orientation="vertical"
                  className="pks_flex rounded-full bg-gray-200 dark:bg-gray-800 w-px h-full"
                  role="separator"
                />
              </div>
              <IconButton
                type="button"
                className="pks_border-none rounded-lg !p-1.5 h-fit"
              >
                <span>
                  <i className="pks_h-4 w-4 flex justify-center">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="pks_w-full h-full"
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
            <div />
            {isValid ? (
              <Button className="pks_border-none pks_rounded-lg !pks_p-1.5 pks_h-fit">
                {loading ? (
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
                className="pks_border-none pks_rounded-lg pks_!p-1.5 pks_h-fit"
              >
                {loading ? (
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
  );
};
