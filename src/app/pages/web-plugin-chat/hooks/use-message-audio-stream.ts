import { useContext, useEffect, useState } from "react";
// Import React hooks for managing component state and lifecycle.

import {
  AssistantDefinition,
  AssistantMessagingRequest,
} from "@/app/clients/protos/talk-api_pb";
// Import protobuf definitions for assistant messaging API.

import {
  AssistantConversationMessage,
  Content,
  Message,
} from "@/app/clients/protos/common_pb";
// Import common protobuf message types.

import { toStreamAudioContent } from "@/utils/rapida_content";
// Import utility function to convert audio data to the appropriate format for streaming.

import { AssistantTalk, GetStageMessage } from "@/app/clients/talk";
// Import gRPC methods for handling assistant conversations and message stages.

// Import context for managing assistant chat state.

import { useEnvironment } from "@/hooks/use-environment";
// Import custom hook for accessing environment variables like assistantId and token.

import { AssistantMessageStage } from "@/app/clients/protos/common_pb";
import { MessageStreamParams } from "@/app/pages/web-plugin-chat/hooks/use-message-text-stream";
import { useRapidaStore } from "@/hooks/use-rapida-store";
import { useMessageNotification } from "@/app/pages/web-plugin-chat/hooks/use-message-notification";
// Import protobuf type for message stages.

// Define interface for parameters passed into the hook.

export const useMessageAudioStream = ({
  onMessaging,
  assistantId,
  assistantVersion,
  assistantConversationId,
  auth,
}: MessageStreamParams) => {
  // Access assistant environment configuration from context.

  // const { onChangeConversactionMessage } = useContext(AssistantChatContext);
  // Access the current conversation ID and update function from the chat context.

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  // State for managing the media recorder instance.

  const [isRecording, setIsRecording] = useState(false);
  // State to track if audio recording is in progress.

  const [doingWhat, setDoingWhat] = useState("listening");
  // State to track the assistant's current activity.

  // const [notificationMessage, setNotificationMessage] =
  //   useState("is listening");
  // State to store the current notification message displayed to the user.

  const { showLoader, hideLoader, loading } = useRapidaStore();
  const {
    onUpdateNotificationStageMessage,
    onUpdateNotificationMessage,
    notificationMessage,
  } = useMessageNotification();

  const [currentTranscribeContent, setCurrentTranscribeContent] = useState<
    Content[]
  >([]);
  // State to store the transcribed content received from the assistant.

  // Utility function to get the appropriate message for the current stage of the assistant's response.

  useEffect(() => {
    if (assistantId && assistantVersion) return;

    const startRecording = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Access the user's microphone to start recording audio.

        const recorder = new MediaRecorder(mediaStream, {
          mimeType: "audio/webm;codecs=opus",
        });
        // Create a MediaRecorder instance to record audio in webm format.

        setMediaRecorder(recorder);
        const stream = AssistantTalk(auth);
        // Initialize gRPC streaming to the assistant with the provided token.

        setIsRecording(true);

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const byteArray = await blobToUint8Array(event.data);
            const request = createRequest(
              assistantId,
              assistantVersion,
              byteArray
            );
            stream.write(request);
          }
        };
        // Handle audio data chunks and send them as requests to the assistant via the gRPC stream.

        recorder.onstart = () => console.log("Recording started");
        // Log when the recording starts.

        recorder.onstop = () => {
          stream.end();
          setIsRecording(false);
        };
        // Stop the gRPC stream and update the recording state when recording stops.

        stream.on("data", (response) => handleStreamData(response));
        stream.on("end", () => {
          onUpdateNotificationMessage("");
          console.log("Transcription stream ended");
        });
        stream.on("status", (status) =>
          console.log("gRPC stream error:", status)
        );
        // Handle gRPC stream events for receiving data, end of stream, and errors.

        recorder.start(2000);
        // Start recording audio with 2-second data chunks.
      } catch (error) {
        console.error("Error accessing audio stream:", error);
      }
    };

    const handleStreamData = (response: any) => {
      const convo = response.getData();
      if (!convo) return;

      if (convo.getStatus() === "IN_PROGRESS" || convo.getId() === "0") {
        setDoingWhat("speaking");
        const contents = convo.getRequest()?.getContentsList();
        if (contents) setCurrentTranscribeContent(contents);
        return;
      }

      onUpdateNotificationStageMessage(convo.getStagesList());
      if (convo.getStatus() === "SUCCESS") {
        setDoingWhat("listening");
        onUpdateNotificationMessage("is listening");
        // if (!assistantConversationId) {
        //   onCreateConversation(convo);
        // }
      }
      onMessaging(convo);

      // onChangeConversactionMessage(convo);
    };
    // Handle incoming data from the gRPC stream, updating state based on conversation progress and stages.

    startRecording();

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
    // Clean up the media recorder and stop any active streams when the component unmounts.
  }, [assistantVersion, assistantId]);

  const createRequest = (
    assistantId: string,
    assistantVersion: string,
    data: Uint8Array
  ) => {
    const request = new AssistantMessagingRequest();
    const def = new AssistantDefinition();
    def.setAssistantid(assistantId);
    def.setVersion(assistantVersion);
    request.setAssistant(def);
    if (assistantConversationId) {
      request.setAssistantconversationid(assistantConversationId);
    }
    const msg = new Message();
    msg.setRole("user");
    msg.addContents(toStreamAudioContent(data));
    request.setMessage(msg);
    return request;
  };
  // Create a new gRPC request containing the assistant ID, version, and audio message content.

  const blobToUint8Array = (blob: Blob): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
  // Convert audio Blob data into a Uint8Array for sending over gRPC.

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop();
    setIsRecording(false);
  };
  // Stop the media recorder and update the recording state.

  return {
    isRecording,
    stopRecording,
    notificationMessage,
    currentTranscribeContent,
    doingWhat,
  };
  // Return the recording state, transcription content, and relevant methods.
};
