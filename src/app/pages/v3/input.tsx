import { cn } from "@/styles/media";
import { HTMLAttributes, FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export const Input: FC<{ onSendMessage: (txt: string) => void }> = ({
  onSendMessage,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmitForm = (data: any) => {
    if (isValid) {
      onSendMessage(data.message);
      reset();
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="WACInputAndCompletions"
    >
      <div
        className={`WACInputContainer ${
          isFocused ? "WACInputContainer--hasFocus" : ""
        }`}
      >
        <div className="WACInputContainer__LeftContainer">
          <div className="WACInputContainer__TextAndUpload">
            <div className="WAC__TextArea WAC__TextArea--autoSize">
              <textarea
                aria-label="Message to send"
                aria-required="false"
                className="WAC__TextArea-textarea"
                id="WACInputContainer-TextArea"
                placeholder="Type something..."
                data-enable-grammarly="false"
                data-test-id="WACInputContainer-TextArea"
                {...register("message", {
                  required: "Please write your message.",
                })}
                required
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(onSubmitForm)(e);
                  }
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              ></textarea>
              <div className="WAC__TextArea-sizer">Type something...</div>
            </div>
          </div>
        </div>

        <button
          id="WACInputContainer__SendButton"
          className={cn(
            "cds--btn--icon-only WACInputContainer__SendButton cds--btn cds--btn-md cds--layout--size-md cds--btn--ghost",
            isValid ? "cds--btn" : "cds--btn--disabled"
          )}
          disabled={!isValid}
          type="submit"
        >
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            fill="currentColor"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M27.45,15.11l-22-11a1,1,0,0,0-1.08.12,1,1,0,0,0-.33,1L7,16,4,26.74A1,1,0,0,0,5,28a1,1,0,0,0,.45-.11l22-11a1,1,0,0,0,0-1.78Zm-20.9,10L8.76,17H18V15H8.76L6.55,6.89,24.76,16Z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
};
