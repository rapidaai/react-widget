import { cn } from "@/styles/media";
import { FC, useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  useConnectAgent,
  useInputModeToggleAgent,
  useMuteAgent,
  useMultibandMicrophoneTrackVolume,
  useSelectInputDeviceAgent,
  MultibandAudioVisualizerComponent,
  Channel,
  VoiceAgent,
} from "@rapidaai/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  Check,
  ChevronDown,
  Loader2,
  MessageSquareText,
  Mic,
  MicOff,
  StopCircleIcon,
} from "lucide-react";

export const Input: FC<{
  onSendMessage: (txt: string) => void;
  voiceAgent: VoiceAgent;
}> = ({ onSendMessage, voiceAgent }) => {
  const { channel, handleVoiceToggle } = useInputModeToggleAgent(voiceAgent);
  const { handleConnectAgent, isConnected, isConnecting } =
    useConnectAgent(voiceAgent);

  const isVoiceMode = channel === Channel.Audio;

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const messageValue = watch("message", "");
  const hasContent = Boolean(messageValue && messageValue.trim().length > 0);

  const onSubmitForm = (data: any) => {
    if (isValid) {
      onSendMessage(data.message);
      reset();
    }
  };

  const [textareaHeight, setTextareaHeight] = useState("auto");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.max(e.target.scrollHeight, 32)}px`;
    if (textareaHeight !== e.target.style.height) {
      setTextareaHeight(e.target.style.height);
    }
  };

  if (isVoiceMode) {
    return <AudioPanel voiceAgent={voiceAgent} />;
  }

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
            onChange: (e) => handleChange(e),
          })}
          required
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(onSubmitForm)(e);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            width: "100%",
            height: textareaHeight,
            border: "none",
            outline: "none",
            resize: "none",
            padding: "0px",
            boxSizing: "border-box",
            backgroundColor: "transparent",
          }}
        />

        {hasContent ? (
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
        ) : (
          <button
            id="WACInputContainer__VoiceButton"
            className="cds--btn--icon-only WACInputContainer__SendButton cds--btn cds--btn-md cds--layout--size-md cds--btn--ghost"
            type="button"
            disabled={isConnecting}
            aria-label={isConnecting ? "Connecting..." : "Start voice input"}
            onClick={async () => {
              await handleVoiceToggle();
              if (!isConnected) {
                await handleConnectAgent();
              }
            }}
          >
            {isConnecting ? (
              <Loader2
                width="24"
                height="24"
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <AudioLines width="24" height="24" />
            )}
          </button>
        )}
      </div>
    </form>
  );
};

const AudioPanel: FC<{ voiceAgent: VoiceAgent }> = ({ voiceAgent }) => {
  const localMultibandVolume = useMultibandMicrophoneTrackVolume(
    voiceAgent,
    5,
    0.05,
    0.85
  );
  const { isConnected, isConnecting, handleDisconnectAgent } =
    useConnectAgent(voiceAgent);
  const { handleTextToggle } = useInputModeToggleAgent(voiceAgent);
  const { isMuted, handleToggleMute } = useMuteAgent(voiceAgent);

  const { devices, activeDeviceId, setActiveMediaDevice } =
    useSelectInputDeviceAgent({
      voiceAgent,
      requestPermissions: true,
    });

  const activeDeviceLabel = useMemo(() => {
    const device = devices.find((d) => d.deviceId === activeDeviceId);
    if (device) {
      const label = device.label || "Unknown Device";
      return label.length > 25 ? label.substring(0, 22) + "..." : label;
    }
    return "Select Microphone";
  }, [devices, activeDeviceId]);

  const handleDeviceChange = useCallback(
    async (deviceId: string) => {
      if (deviceId !== activeDeviceId) {
        await setActiveMediaDevice(deviceId);
      }
    },
    [activeDeviceId, setActiveMediaDevice]
  );

  const visualizerFrequencies = useMemo(() => {
    if (isMuted) {
      return Array.from({ length: 5 }, () => [0.02]);
    }
    return localMultibandVolume.length > 0
      ? localMultibandVolume
      : Array.from({ length: 5 }, () => [0.02]);
  }, [isMuted, localMultibandVolume]);

  return (
    <div className="WACInputAndCompletions">
      <div
        className="WACInputContainer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          padding: "8px",
        }}
      >
        {/* Mic mute/unmute button */}
        <button
          type="button"
          disabled={!isConnected}
          onClick={async () => await handleToggleMute()}
          className="cds--btn--icon-only cds--btn cds--btn--md cds--layout--size-md cds--btn--ghost"
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
          style={{ color: isMuted ? "#da1e28" : undefined }}
        >
          {isMuted ? (
            <MicOff width="20" height="20" />
          ) : (
            <Mic width="20" height="20" />
          )}
        </button>

        {/* Visualizer + device selector */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}
        >
          <MultibandAudioVisualizerComponent
            state={isMuted ? "disconnected" : "listening"}
            barWidth={4}
            minBarHeight={3}
            maxBarHeight={18}
            frequencies={visualizerFrequencies}
          />

          <DeviceSelectorFlyout
            devices={devices}
            activeDeviceId={activeDeviceId}
            activeDeviceLabel={activeDeviceLabel}
            onDeviceChange={handleDeviceChange}
          />
        </div>

        {/* Switch to text button */}
        <button
          type="button"
          disabled={!isConnected}
          onClick={async () => await handleTextToggle()}
          className="cds--btn--icon-only cds--btn cds--btn--md cds--layout--size-md cds--btn--ghost"
          aria-label="Switch to text"
        >
          <MessageSquareText width="20" height="20" />
        </button>

        {/* Stop / disconnect button */}
        <button
          type="button"
          disabled={!isConnected && !isConnecting}
          onClick={async () => await handleDisconnectAgent()}
          className="cds--btn--icon-only cds--btn cds--btn--md cds--layout--size-md cds--btn--ghost"
          aria-label="Stop voice"
          style={{ color: "#da1e28" }}
        >
          <StopCircleIcon width="20" height="20" />
        </button>
      </div>
    </div>
  );
};

const DeviceSelectorFlyout: FC<{
  devices: MediaDeviceInfo[];
  activeDeviceId: string;
  activeDeviceLabel: string;
  onDeviceChange: (deviceId: string) => void;
}> = ({ devices, activeDeviceId, activeDeviceLabel, onDeviceChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        className="cds--btn cds--btn--md cds--btn--ghost"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12px",
          padding: "4px 8px",
          height: "auto",
          minHeight: "unset",
        }}
      >
        <span
          style={{
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {activeDeviceLabel}
        </span>
        <ChevronDown
          width="14"
          height="14"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 0,
              zIndex: 50,
              background: "#fff",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              minWidth: "260px",
              maxWidth: "300px",
            }}
          >
            <div
              style={{
                padding: "6px 12px",
                borderBottom: "1px solid #e0e0e0",
                fontSize: "11px",
                fontWeight: 600,
                color: "#6f6f6f",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Select Microphone
            </div>
            <div style={{ padding: "4px", maxHeight: "180px", overflowY: "auto" }}>
              {devices.map((device, idx) => {
                const isActive = activeDeviceId === device.deviceId;
                return (
                  <button
                    key={device.deviceId || idx}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: "13px",
                      background: isActive ? "#0f62fe" : "transparent",
                      color: isActive ? "#fff" : "#161616",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => onDeviceChange(device.deviceId)}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {device.label || `Microphone ${idx + 1}`}
                    </span>
                    {isActive && <Check width="14" height="14" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
