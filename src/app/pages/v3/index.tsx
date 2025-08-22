import { cn } from "@/styles/media";
import {
  AssistantWebpluginDeployment,
  useAgentMessage,
  useConnectAgent,
  useEnsureVoiceAgent,
} from "rapida-react";
import React, { useState, useEffect, FC, useRef } from "react";
import { formatTimeToHHMMPM } from "@/utils/time";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Input } from "@/app/pages/v3/input";

export const ChatComponent: React.FC<{
  deployment: AssistantWebpluginDeployment;
}> = ({ deployment }) => {
  const [open, setOpen] = useState(false);
  const ctx = useEnsureVoiceAgent();
  const { handleConnectAgent, handleDisconnectAgent, isConnected } =
    useConnectAgent();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
    }
  }, [isConnected]);
  const handleDisconnectClick = () => {
    if (isConnected) {
      setIsLoading(true);
      handleDisconnectAgent(ctx);
    } else {
      handleConnectAgent(ctx);
    }
  };

  return (
    <div className="RPDContainer" id="RPDContainer">
      <div className="RPDContainer--render cds--g10 WAC--aiTheme" dir="auto">
        <div dir="ltr" className="RPDContainer__LayoutDirection">
          <div
            className="WACWidget__regionContainer"
            role="region"
            aria-label="Chat"
          >
            <div className="WACMainWindow WACWidget__FocusTrapContainer">
              <div
                id="WACWidget"
                className={cn(
                  "WACWidget WACLocale-en WACWidget--rounded WACWidget--defaultElement WACWidget--launched",
                  open
                    ? "WAC--standardWidth"
                    : "WACWidget--closed WAC--narrowWidth"
                )}
              >
                <div className="WACWidget__animationContainer">
                  <div className="WACWidget--content">
                    {/*  */}
                    <div className="WACBotContainer">
                      <div className="WAC">
                        <div className="WACHeader__Container">
                          <div className="WACHeader WAC--primaryColor">
                            <div
                              className="WACHeader--content WAC--primaryColor"
                              data-floating-menu-container="true"
                            >
                              <div className="WACHeader__Buttons WACHeader__LeftButtons"></div>
                              <div className="WACHeader__CenterContainer">
                                <div className="WACHeader__Name WACWidget__textEllipsis"></div>
                              </div>
                              <div className="WACHeader__Buttons WACHeader__RightButtons">
                                <button
                                  aria-labelledby="tooltip-:r7m:"
                                  className="cds--btn--icon-only WACHeader__RestartButton WACDirectionHasReversibleSVG cds--btn cds--btn--md cds--layout--size-md cds--btn--ghost"
                                  type="button"
                                  onClick={() => {
                                    isConnected && handleDisconnectClick();
                                  }}
                                >
                                  <svg
                                    focusable="false"
                                    preserveAspectRatio="xMidYMid meet"
                                    fill="currentColor"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M13,9c0,2.8-2.2,5-5,5s-5-2.2-5-5s2.2-5,5-5h3.1L9.3,5.8L10,6.5l3-3l-3-3L9.3,1.2L11.1,3H8C4.7,3,2,5.7,2,9s2.7,6,6,6 s6-2.7,6-6H13z"></path>
                                  </svg>
                                </button>
                                <button
                                  aria-labelledby="tooltip-:r7p:"
                                  className="cds--btn--icon-only WACHeader__CloseButton WACDirectionHasReversibleSVG cds--btn cds--btn--md cds--layout--size-md cds--btn--ghost"
                                  type="button"
                                  onClick={() => setOpen(false)}
                                >
                                  <svg
                                    focusable="false"
                                    preserveAspectRatio="xMidYMid meet"
                                    fill="currentColor"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 32 32"
                                    aria-hidden="true"
                                    className="WACIcon__Subtract"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M5 15L5 17 27 17 27 15 5 15z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <AssistantChatter
                          deployment={deployment}
                          onSendMessage={(msg: string) => {
                            ctx?.onSendText(msg);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FloatingButton
              open={open}
              setOpen={setOpen}
              appIcon={deployment.getUrl()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AssistantChatter: FC<{
  deployment: AssistantWebpluginDeployment;
  onSendMessage: (txt: string) => void;
}> = ({ deployment, onSendMessage }) => {
  return (
    <div className="WACPanelContent WAC__ChatNonHeaderContainer">
      <div className="WAC__messagesAndInputContainer">
        <div className="WACMessagesContainer__NonInputContainer">
          <div id="WACMessages--holder" className="WACMessages--holder">
            <Messages deployment={deployment} onSendMessage={onSendMessage} />
          </div>
        </div>
        <Input onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

const Messages: FC<{
  deployment: AssistantWebpluginDeployment;
  onSendMessage: (txt: string) => void;
}> = ({ deployment, onSendMessage }) => {
  const { messages } = useAgentMessage();
  const scrollRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [JSON.stringify(messages)]);

  return (
    <div id="WAC__messages" className="WAC__messages" role="list">
      <button
        type="button"
        className="WACMessages--scrollHandle"
        tabIndex={0}
        aria-label="Chat history begin. Activate to focus the first message then use the arrow, home, and end keys to move between messages. Press escape to exit."
      />
      <div className="ibm-web-chat--reset-styles" id="welcomeNodeBeforeElement">
        <div></div>
      </div>
      <div
        id="WAC__message-0"
        className="WAC__message WAC__message-0 WAC__message--firstMessage WAC__message--withAvatarLine WAC__message--response WAC__message--no-animation"
      >
        <div className="WACMessage--focusHandle" role="listitem"></div>
        <div className="WACMessage__AvatarLine">
          <div className="WACMessage__Avatar WACMessage__Avatar--bot">
            <div className="WACImageWithFallback">
              <img
                alt="Assistant Icon"
                src={deployment.getUrl()}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%",
                }}
              />
            </div>
          </div>
          <div className="WACMessage__Label">{deployment.getName()}</div>
        </div>
        <div className="WAC__message--padding">
          <div className="WAC__bot-message">
            <div className="WAC__received WAC__message-vertical-padding WAC__received--text">
              <div className="WAC__received--inner">
                <div className="WAC__received--textContent">
                  <div className="WACStreamingRichText">
                    <div className="ibm-web-chat--default-styles">
                      <MarkdownPreview
                        source={deployment.getGreeting()}
                        className="WACWidget__Markdown"
                        style={{ background: "transparent" }}
                      />
                    </div>
                  </div>
                  {/*  */}
                </div>

                <div className="contact-options">
                  {deployment.getSuggestionList().map((x, idx) => {
                    return (
                      <div
                        key={idx}
                        className="ibm-unified-chat--card ibm-unified-chat--card--customized ibm-unified-chat--card"
                        onClick={() => {
                          onSendMessage(x);
                        }}
                      >
                        <span className="ibm-unified-chat--card-icon ibm-unified-chat--card-icon">
                          <svg
                            id="ucx-f8d06fc6-40e6-4af6-86e6-922649248272"
                            focusable="false"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#0f62fe"
                            width="25"
                            height="25"
                            viewBox="0 0 36 36"
                            aria-hidden="true"
                            data-di-rand="1749144538514"
                          >
                            <polygon points="18 6 16.57 7.393 24.15 15 4 15 4 17 24.15 17 16.57 24.573 18 26 28 16 18 6" />
                            <title>{x}</title>
                          </svg>
                        </span>
                        <div className="spinnerContainer">
                          <span className="cardLabel">{x}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="scroll_block"></div>
                </div>

                {/*  */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  */}

      {messages.map((x) => {
        return x.role == "user" ? (
          <div
            key={x.id}
            id={`WAC__message-${x.id}`}
            className="WAC__message WAC__message-13 WAC__message--withAvatarLine WAC__message--request"
          >
            <div className="WACMessage--focusHandle" role="listitem"></div>
            <div className="WACMessage__AvatarLine">
              <div className="WACMessage__Label">
                You {formatTimeToHHMMPM(x.time)}
              </div>
            </div>

            <div className="WAC__message--padding">
              <div className="WAC__sent-container">
                <div className="WAC__sentAndMessageState-container WAC__message-vertical-padding">
                  <div className="WAC__sent">
                    <div className="WACVisuallyHidden">You said</div>
                    <div className="WAC__sent--bubble">
                      <div>
                        <div className="WAC__sent--text">
                          {x.messages.map((x, ix) => (
                            <MarkdownPreview
                              key={ix}
                              source={x}
                              className="WACWidget__Markdown"
                              style={{ background: "transparent" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="WAC__message-12"
            className="WAC__message WAC__message-12 WAC__message--withAvatarLine WAC__message--response"
          >
            <div className="WACMessage--focusHandle" role="listitem"></div>
            <div className="WACMessage__AvatarLine">
              <div className="WACMessage__Avatar WACMessage__Avatar--bot">
                <div className="WACImageWithFallback">
                  <img
                    alt="Assistant Icon"
                    src={deployment.getUrl()}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                    }}
                  />
                </div>
              </div>
              <div className="WACMessage__Label">
                {deployment.getName()} {formatTimeToHHMMPM(x.time)}
              </div>
            </div>
            <div className="WAC__message--padding">
              <div className="WAC__bot-message">
                <div className="WAC__received WAC__message-vertical-padding WAC__received--options">
                  <div className="WAC__received--inner">
                    <div className="WAC__received--metablock">
                      <div className="WAC__description WAC__received--metablock-content WACMetablock__Title">
                        <div className="ibm-web-chat--default-styles">
                          {x.messages.map((x, ix) => (
                            <MarkdownPreview
                              key={ix}
                              source={x}
                              className="WACWidget__Markdown"
                              style={{ background: "transparent" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <div className="WAC__message WAC__message--lastMessage">
          <div className="WAC__message--padding">
            <div></div>
            <div className="WAC__bot-message">
              <div className="WAC__received WAC__received--loading WAC__message-vertical-padding">
                <div className="WAC__received--inner">
                  <div className="WAC__LoadingIcon" aria-hidden="true">
                    <span className="WAC__loading-ball"></span>
                    <span className="WAC__loading-ball"></span>
                    <span className="WAC__loading-ball"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        ref={scrollRef}
        className="WACMessages--scrollHandle"
        aria-label="Chat history end. Activate to focus the last message then use the arrow, home, and end keys to move between messages. Press escape to exit."
      ></button>
    </div>
  );
};

const FloatingButton: FC<{
  open: boolean;
  setOpen: (bl: boolean) => void;
  appIcon: string;
}> = ({ open, setOpen, appIcon }) => {
  return (
    <div
      className={cn(
        "WACLauncher__ButtonContainer WACLauncher__ButtonContainer--round WACLauncher__ButtonContainer--noAnimation",
        open
          ? "WACLauncher__ButtonContainer--hidden"
          : "WACLauncher__ButtonContainer"
      )}
    >
      <button
        aria-label="Close the chat window"
        id="WACLauncher__Button"
        className="WACLauncher__Button cds--btn cds--btn--primary"
        type="button"
        data-di-id="#WACLauncher__Button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <img
          alt="Assistant Icon"
          src={appIcon}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "100%",
          }}
        />
      </button>
    </div>
  );
};
