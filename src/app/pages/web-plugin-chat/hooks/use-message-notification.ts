import { AssistantMessageStage } from "@/app/clients/protos/common_pb";
import { GetStageMessage } from "@/app/clients/talk";
import { useState } from "react";

export const useMessageNotification = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificaitonType] = useState("success");

  const onUpdateNotificationMessage = (
    message: string,
    type?: "success" | "error"
  ) => {
    setNotificaitonType(type === "error" ? type : "success");
    setNotificationMessage(message);
  };

  const onClearNotification = () => {
    setNotificationMessage("");
  };

  const onUpdateNotificationStageMessage = (
    stages: Array<AssistantMessageStage>
  ) => {
    let stage = stages.at(stages.length - 1);
    setNotificationMessage(
      stage ? GetStageMessage(stage.getStage()) : "Please wait..."
    );
  };

  return {
    notificationMessage,
    notificationType,
    onUpdateNotificationStageMessage,
    onUpdateNotificationMessage,
    onClearNotification,
  };
};
