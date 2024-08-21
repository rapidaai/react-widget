import { ScalableTextarea } from "@/app/app/components/textareas";
import { useForm } from "react-hook-form";
import { Button, HoverButton } from "@/app/app/components/buttons";
import { UpArrowIcon } from "@/app/icons/up-arrow";
import { Spinner } from "@/app/app/components/loaders/spinner";
import { cn } from "@/app/styles/media";
// import { useCredential, useRapidaStore } from "@/hooks";
import { FC, useContext, useState } from "react";
import { Message } from "@/app/clients/protos/common_pb";
import { toTextContent, toTitleCase } from "@/app/utils";
import {
  AssistantConversactionMessage,
  AssistantMessageStage,
  CreateAssistantMessageResponse,
} from "@/app/clients/protos/talk-api_pb";
import { AssistantChatContext } from "@/app/hooks/use-assistant-chat";
import * as grpcWeb from "grpc-web";
import { GetStageMessage } from "@/app/clients/talk";
import { Assistant } from "@/app/clients/protos/assistant-api_pb";
import { DotLoader } from "@/app/app/components/loaders/dot-loader";
/**
 *
 */
interface ChatFooterProps {
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
      className={cn("flex flex-col items-center relative p-2")}
    >
      <ScalableTextarea
        placeholder="How can i help you today?"
        spellCheck="false"
        wrapperClassName="shadow"
        className="text-[14px] px-1"
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
          isValid
            ? [
                <Button className="w-8 h-8 p-1.5 rounded-md">
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon strokeWidth={1.6} className="text-white" />
                  )}
                </Button>,
              ]
            : [
                <HoverButton type="button" className="w-8 h-8 p-1.5 rounded-md">
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <UpArrowIcon strokeWidth={2} />
                  )}
                </HoverButton>,
              ]
        }
      ></ScalableTextarea>
    </form>
  );
};
