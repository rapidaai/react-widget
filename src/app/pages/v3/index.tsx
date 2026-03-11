import {
  AssistantWebpluginDeployment,
  useAgentMessages,
  useConnectAgent,
  VoiceAgent,
} from "@rapidaai/react";
import React, { useState, useEffect, FC, useRef, useCallback } from "react";
import { formatTimeToHHMMPM } from "@/utils/time";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Input } from "@/app/pages/v3/input";
import { useEnvironment } from "@/hooks/use-environment";

/* ================================================================
   Icons — Carbon 16px
   ================================================================ */
const IconMinimize: FC = () => (
  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
    <path d="M5 15h22v2H5z" />
  </svg>
);

const IconChat: FC = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor">
    <path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z" />
    <path d="M8 10H24V12H8zM8 16H18V18H8z" />
  </svg>
);

const IconArrowRight: FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 32 32"
    fill="currentColor"
    strokeWidth={1.5}
  >
    <path d="M18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10z" />
  </svg>
);

const IconChevronLeft: FC = () => (
  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
    <path d="M10 16L20 6l1.4 1.4-8.6 8.6 8.6 8.6L20 26z" />
  </svg>
);

const IconChevronRight: FC = () => (
  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
    <path d="M22 16L12 26l-1.4-1.4 8.6-8.6-8.6-8.6L12 6z" />
  </svg>
);

/** Watson-style bot avatar */
const BotAvatarIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
    <circle cx="16" cy="16" r="2" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="16" cy="24" r="2" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="24" cy="12" r="2" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="24" cy="20" r="2" />
    <line
      x1="16"
      y1="10"
      x2="16"
      y2="14"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="16"
      y1="18"
      x2="16"
      y2="22"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="9.5"
      y1="13"
      x2="14.5"
      y2="15"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="17.5"
      y1="15"
      x2="22.5"
      y2="13"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="9.5"
      y1="19"
      x2="14.5"
      y2="17"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="17.5"
      y1="17"
      x2="22.5"
      y2="19"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

/* ================================================================
   Main export
   ================================================================ */
export const ChatComponent: FC<{
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
}> = ({ deployment, voiceAgent }) => {
  const { theme } = useEnvironment();
  const config = window.chatbotConfig;
  const layout = config?.layout || "floating";
  const position = config?.position || "bottom-right";
  const showLauncher = config?.showLauncher !== false;
  const themeMode = theme?.mode || "light";
  const displayName = config?.name || deployment.getName() || "Assistant";

  const isDocked = layout === "docked-right" || layout === "docked-left";
  const dockSide = layout === "docked-left" ? "left" : "right";

  // Docked starts open, floating starts closed
  const [open, setOpen] = useState(isDocked);

  // Manage body margin for docked layout
  useEffect(() => {
    if (!isDocked) return;
    const cls = `rpd-body--docked-${dockSide}`;
    if (open) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => document.body.classList.remove(cls);
  }, [isDocked, dockSide, open]);

  // Shell class
  const shellClass = isDocked
    ? `rpd-shell rpd-shell--docked rpd-shell--docked-${dockSide}`
    : `rpd-shell rpd-shell--${position} ${layout === "inline" ? "rpd-shell--inline" : ""}`;

  return (
    <div className="rpd" data-rpd-theme={themeMode}>
      <div className={shellClass}>
        {/* Panel */}
        <div
          className={`rpd-panel ${open ? "" : "rpd-panel--closed"}`}
          role="dialog"
          aria-label="Chat"
        >
          {/* Header */}
          <div className="rpd-header">
            <div className="rpd-header__spacer" />
            <button
              className="rpd-btn-icon"
              type="button"
              aria-label={isDocked ? "Collapse" : "Minimize"}
              onClick={() => setOpen(false)}
            >
              {isDocked ? (
                dockSide === "right" ? (
                  <IconChevronRight />
                ) : (
                  <IconChevronLeft />
                )
              ) : (
                <IconMinimize />
              )}
            </button>
          </div>

          {/* Messages */}
          <MessagesArea
            deployment={deployment}
            voiceAgent={voiceAgent}
            botName={displayName}
            logoUrl={config?.logo_url}
            onSendMessage={(msg) => voiceAgent?.onSendText(msg)}
          />

          {/* Input */}
          <Input
            voiceAgent={voiceAgent}
            onSendMessage={(msg) => voiceAgent?.onSendText(msg)}
            voiceEnabled={
              !!deployment.getInputaudio() && !!deployment.getOutputaudio()
            }
          />
        </div>

        {/* Floating launcher */}
        {!isDocked && showLauncher && (
          <button
            className={`rpd-launcher ${open ? "rpd-launcher--hidden" : ""}`}
            type="button"
            aria-label="Open chat"
            onClick={() => setOpen(true)}
          >
            <IconChat />
          </button>
        )}
      </div>

      {/* Docked expand tab — shown when docked + collapsed */}
      {isDocked && !open && (
        <button
          className={`rpd-docked-tab rpd-docked-tab--${dockSide}`}
          type="button"
          aria-label="Open chat"
          onClick={() => setOpen(true)}
        >
          Chat
        </button>
      )}
    </div>
  );
};

/* ================================================================
   Group consecutive messages by role
   ================================================================ */
type MessageItem = { id: string; role: string; time: Date; messages: string[] };
type MessageGroup = { role: string; items: MessageItem[] };

function groupMessages(messages: MessageItem[]): MessageGroup[] {
  return messages.reduce<MessageGroup[]>((acc, msg) => {
    const last = acc[acc.length - 1];
    if (last && last.role === msg.role) {
      last.items.push(msg);
    } else {
      acc.push({ role: msg.role, items: [msg] });
    }
    return acc;
  }, []);
}

/* ================================================================
   Messages area
   ================================================================ */
const MessagesArea: FC<{
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  botName: string;
  logoUrl?: string;
  onSendMessage: (txt: string) => void;
}> = ({ deployment, voiceAgent, botName, logoUrl, onSendMessage }) => {
  const { messages } = useAgentMessages(voiceAgent);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [JSON.stringify(messages)]);
  const suggestions = deployment.getSuggestionList();
  const greeting = deployment.getGreeting();

  return (
    <div className="rpd-messages" role="log" aria-live="polite">
      {/* Greeting */}
      <div className="rpd-msg-bot">
        <BotMessageHeader name={botName} logoUrl={logoUrl} />
        <div className="rpd-msg-bot__body">
          <MarkdownPreview
            source={greeting}
            className="rpd-md"
            style={{ background: "transparent" }}
          />
        </div>

        {suggestions.length > 0 && (
          <>
            <div className="rpd-cards">
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  className="rpd-card"
                  type="button"
                  onClick={() => onSendMessage(text)}
                >
                  <span className="rpd-card__text">{text}</span>
                  <span className="rpd-card__icon">
                    <IconArrowRight />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Conversation — group consecutive messages by same role */}
      {groupMessages(messages).map((group, gi) =>
        group.role === "user" ? (
          <div key={gi} className="rpd-msg-user">
            <div className="rpd-msg-user__meta">
              <span className="rpd-msg-user__name">You</span>
              <span className="rpd-msg-user__time">
                {formatTimeToHHMMPM(group.items[0].time)}
              </span>
            </div>
            <div className="rpd-msg-user__bubble">
              {group.items.map((msg) =>
                msg.messages.map((m, ix) => (
                  <MarkdownPreview
                    key={`${msg.id}-${ix}`}
                    source={m}
                    className="rpd-md"
                    style={{ background: "transparent" }}
                  />
                )),
              )}
            </div>
          </div>
        ) : (
          <div key={gi} className="rpd-msg-bot">
            <BotMessageHeader
              name={botName}
              logoUrl={logoUrl}
              time={group.items[0].time}
            />
            <div className="rpd-msg-bot__body">
              {group.items.map((msg) =>
                msg.messages.map((m, ix) => (
                  <MarkdownPreview
                    key={`${msg.id}-${ix}`}
                    source={m}
                    className="rpd-md"
                    style={{ background: "transparent" }}
                  />
                )),
              )}
            </div>
          </div>
        ),
      )}

      {/* Typing */}
      {messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <div className="rpd-typing">
          <span className="rpd-typing__dot" />
          <span className="rpd-typing__dot" />
          <span className="rpd-typing__dot" />
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
};

/* ================================================================
   Shared sub-components
   ================================================================ */
const BotMessageHeader: FC<{ name: string; logoUrl?: string; time?: Date }> = ({
  name,
  logoUrl,
  time,
}) => (
  <div className="rpd-msg-bot__header">
    {logoUrl ? (
      <img className="rpd-msg-bot__avatar-img" src={logoUrl} alt={name} />
    ) : (
      <div className="rpd-msg-bot__avatar">
        <BotAvatarIcon />
      </div>
    )}
    <span className="rpd-msg-bot__name">{name}</span>
    {time && (
      <span className="rpd-msg-bot__time">{formatTimeToHHMMPM(time)}</span>
    )}
  </div>
);
