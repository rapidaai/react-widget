import { useConnectAgent, useInputModeToggleAgent } from "rapida-react";
import { useEnsureVoiceAgent } from "rapida-react";
import { Send } from "lucide-react";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/styles/media";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@/app/components/loaders/spinner";
import { useEnvironment } from "@/hooks/use-environment";
import { ScalableTextarea } from "@/app/components/textareas";

interface SimpleMessagingAcitonProps extends HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
}
export const SimpleMessagingAction: FC<SimpleMessagingAcitonProps> = ({
  className,
  placeholder,
}) => {
  const ctx = useEnsureVoiceAgent();
  const { handleConnectAgent, handleDisconnectAgent, isConnected } =
    useConnectAgent();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useEnvironment();

  //
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
    }
  }, [isConnected]);

  const handleDisconnectClick = (ctx: any) => {
    if (isConnected) {
      setIsLoading(true);
      handleDisconnectAgent(ctx);
    } else {
      handleConnectAgent(ctx);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmitForm = (data: any) => {
    ctx?.onSendText(data.message);
    reset();
  };

  return (
    <div>
      <form
        className={cn(
          "pks_relative pks_flex pks_items-center pks_border-t pks_m-0 focus-within:pks_border-primary  dark:pks_border-gray-700",
          className
        )}
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <ScalableTextarea
          className="pks_bg-white pks_resize-none !pks_border-none pks_pr-9 pks_p-2 pks_h-[40px] pks_w-full pks_text-base disabled:pks_opacity-50 disabled:pks_pointer-events-none dark:pks_placeholder-gray-500 dark:pks_text-gray-300 pks_bg-transparent focus:pks_border-none focus:pks_outline-none"
          placeholder={placeholder}
          {...register("message", {
            required: "Please write your message.",
          })}
          required
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(onSubmitForm)(e);
            }
          }}
          wrapperClassName="!pks_border-none pks_bg-white"
          actions={
            // <div className="pks_absolute pks_rounded-b-lg pks_right-2 pks_my-auto pks_w-fit">
            <button
              type="submit"
              style={{
                background: theme.color,
              }}
              className={cn(
                !isValid && "pks_hidden",
                "pks_inline-flex pks_shrink-0 pks_justify-center pks_items-center pks_h-10 pks_w-10 pks_rounded-full pks_text-white focus:pks_z-10 focus:pks_outline-none"
              )}
            >
              <Send
                className="pks_shrink-0 pks_h-[17px] pks_w-[17px]"
                strokeWidth="1.5"
              />
            </button>
            // </div>
          }
        ></ScalableTextarea>
      </form>
    </div>
  );
};
