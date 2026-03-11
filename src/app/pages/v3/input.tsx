import { FC, useState, useMemo, useCallback, useRef } from "react";
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
  Send,
  StopCircle,
} from "lucide-react";

/* ================================================================
   Main input — mirrors UI's MessagingAction
   Stable wrapper div so React reconciles children in-place.
   ================================================================ */
export const Input: FC<{
  onSendMessage: (txt: string) => void;
  voiceAgent: VoiceAgent;
  voiceEnabled?: boolean;
}> = ({ onSendMessage, voiceAgent, voiceEnabled = false }) => {
  const { channel } = useInputModeToggleAgent(voiceAgent);

  return (
    <div>
      {voiceEnabled && channel === Channel.Audio ? (
        <AudioPanel voiceAgent={voiceAgent} />
      ) : (
        <TextInput
          onSendMessage={onSendMessage}
          voiceAgent={voiceAgent}
          voiceEnabled={voiceEnabled}
        />
      )}
    </div>
  );
};

/* ================================================================
   Text input — mirrors UI's SimpleMessagingAction
   ================================================================ */
const TextInput: FC<{
  onSendMessage: (txt: string) => void;
  voiceAgent: VoiceAgent;
  voiceEnabled: boolean;
}> = ({ onSendMessage, voiceAgent, voiceEnabled }) => {
  const { handleVoiceToggle } = useInputModeToggleAgent(voiceAgent);
  const { handleConnectAgent, handleDisconnectAgent, isConnected, isConnecting } =
    useConnectAgent(voiceAgent);

  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({ mode: "onChange" });

  const onSubmitForm = (data: any) => {
    if (isValid) {
      onSendMessage(data.message);
      reset();
    }
  };

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className={`rpd-input ${isFocused ? "rpd-input--focused" : ""}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        textareaRef.current?.focus();
      }}
    >
      <textarea
        aria-label="Type a message"
        className="rpd-textarea"
        placeholder="Type something..."
        rows={1}
        {...register("message", {
          required: true,
          onChange: handleResize,
        })}
        ref={(el) => {
          register("message").ref(el);
          textareaRef.current = el;
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmitForm)(e);
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Action buttons */}
      <div className="rpd-input__actions">
        {isValid ? (
          <button
            className="rpd-action-btn rpd-action-btn--primary"
            type="submit"
            aria-label="Send"
          >
            <Send width="14" height="14" />
          </button>
        ) : voiceEnabled ? (
          <button
            className="rpd-action-btn rpd-action-btn--primary"
            type="button"
            disabled={isConnecting}
            aria-label={isConnecting ? "Connecting..." : "Voice"}
            onClick={async () => {
              await handleVoiceToggle();
              !isConnected && (await handleConnectAgent());
            }}
          >
            {isConnecting ? (
              <Loader2 width="14" height="14" className="rpd-spin" />
            ) : (
              <AudioLines width="14" height="14" />
            )}
          </button>
        ) : (
          <button
            className="rpd-action-btn rpd-action-btn--primary"
            type="submit"
            disabled
            aria-label="Send"
          >
            <Send width="14" height="14" />
          </button>
        )}

        {(isConnected || isConnecting) && (
          <button
            className="rpd-action-btn rpd-action-btn--danger"
            type="button"
            disabled={!isConnected && !isConnecting}
            aria-label="Stop"
            onClick={async () => {
              await handleDisconnectAgent();
            }}
          >
            <StopCircle width="14" height="14" />
          </button>
        )}
      </div>
    </form>
  );
};

/* ================================================================
   Audio panel — mirrors UI's AudioMessagingAction
   ================================================================ */
const AudioPanel: FC<{ voiceAgent: VoiceAgent }> = ({ voiceAgent }) => {
  const localMultibandVolume = useMultibandMicrophoneTrackVolume(
    voiceAgent,
    5,
    0.05,
    0.85,
  );
  const { isConnected, isConnecting, handleDisconnectAgent } =
    useConnectAgent(voiceAgent);
  const { handleTextToggle } = useInputModeToggleAgent(voiceAgent);
  const { isMuted, handleToggleMute } = useMuteAgent(voiceAgent);

  const { devices, activeDeviceId, setActiveMediaDevice } =
    useSelectInputDeviceAgent({
      voiceAgent: voiceAgent,
      requestPermissions: true,
    });

  const activeDeviceLabel = useMemo(() => {
    const d = devices.find((d) => d.deviceId === activeDeviceId);
    if (d) {
      const l = d.label || "Unknown Device";
      return l.length > 25 ? l.substring(0, 22) + "..." : l;
    }
    return "Select Microphone";
  }, [devices, activeDeviceId]);

  const handleDeviceChange = useCallback(
    async (id: string) => {
      if (id !== activeDeviceId) await setActiveMediaDevice(id);
    },
    [activeDeviceId, setActiveMediaDevice],
  );

  const frequencies = useMemo(() => {
    if (isMuted) return Array.from({ length: 5 }, () => [0.02]);
    return localMultibandVolume.length > 0
      ? localMultibandVolume
      : Array.from({ length: 5 }, () => [0.02]);
  }, [isMuted, localMultibandVolume]);

  return (
    <div className="rpd-audio">
      <div className="rpd-audio__toolbar">
        {/* Mute */}
        <button
          type="button"
          disabled={!isConnected}
          onClick={async () => {
            await handleToggleMute();
          }}
          className={`rpd-audio__btn ${isMuted ? "rpd-audio__btn--muted" : ""}`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <MicOff width="16" height="16" />
          ) : (
            <Mic width="16" height="16" />
          )}
        </button>

        {/* Visualizer + Device */}
        <div className="rpd-audio__viz">
          <MultibandAudioVisualizerComponent
            state={isMuted ? "disconnected" : "listening"}
            barWidth={4}
            minBarHeight={3}
            maxBarHeight={18}
            barColor={isMuted ? "rpd-bar rpd-bar--muted" : "rpd-bar"}
            frequencies={frequencies}
            classNames="rpd-visualizer"
          />
          <DeviceSelectorFlyout
            devices={devices}
            activeDeviceId={activeDeviceId}
            activeDeviceLabel={activeDeviceLabel}
            onDeviceChange={handleDeviceChange}
          />
        </div>

        {/* Switch to text */}
        <button
          type="button"
          disabled={!isConnected}
          onClick={async () => {
            await handleTextToggle();
          }}
          className="rpd-audio__btn"
          aria-label="Switch to text"
        >
          <MessageSquareText width="16" height="16" />
        </button>

        {/* Stop */}
        <button
          type="button"
          disabled={!isConnected && !isConnecting}
          onClick={async () => {
            await handleDisconnectAgent();
          }}
          className="rpd-audio__btn rpd-audio__btn--stop"
          aria-label="Stop"
        >
          {isConnecting ? (
            <Loader2 width="16" height="16" className="rpd-spin" />
          ) : (
            <StopCircle width="16" height="16" />
          )}
        </button>
      </div>
    </div>
  );
};

/* ================================================================
   Device selector flyout
   ================================================================ */
const DeviceSelectorFlyout: FC<{
  devices: MediaDeviceInfo[];
  activeDeviceId: string;
  activeDeviceLabel: string;
  onDeviceChange: (id: string) => void;
}> = ({ devices, activeDeviceId, activeDeviceLabel, onDeviceChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rpd-device">
      <button
        type="button"
        className="rpd-device__trigger"
        onClick={() => setOpen(!open)}
      >
        <span className="rpd-device__label">{activeDeviceLabel}</span>
        <ChevronDown
          width="14"
          height="14"
          style={{
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="rpd-device__backdrop"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="rpd-device__flyout"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="rpd-device__heading">Select Microphone</div>
              <div className="rpd-device__list">
                {devices.length === 0 && (
                  <div className="rpd-device__empty">No microphones found</div>
                )}
                {devices.map((device, idx) => {
                  const active = activeDeviceId === device.deviceId;
                  return (
                    <button
                      key={device.deviceId || idx}
                      type="button"
                      className={`rpd-device__item ${active ? "rpd-device__item--active" : ""}`}
                      onClick={() => {
                        onDeviceChange(device.deviceId);
                        setOpen(false);
                      }}
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
                      {active && <Check width="14" height="14" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
