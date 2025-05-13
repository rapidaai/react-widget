import { cn } from "@/styles/media";
import {
  AgentWebpluginDeployment,
  Message,
  MessageRole,
  MessageStatus,
  useAgentMessage,
  useMaybeVoiceAgent,
  useMessageFeedback,
} from "rapida-react";
import { FC, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useEnvironment } from "@/hooks/use-environment";
import { DotLoader } from "@/app/components/loaders/dot-loader";
import { ArrowRight, Link } from "lucide-react";
export const ConversationMessages: FC<{
  deployment: AgentWebpluginDeployment;
}> = ({ deployment }) => {
  const { handleHelpfulnessFeedback } = useMessageFeedback();
  const { messages } = useAgentMessage();
  const ctx = useMaybeVoiceAgent();

  //
  const ctrRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: any) => {
    setTimeout(
      () =>
        ref.current?.scrollIntoView({ inline: "center", behavior: "smooth" }),
      777
    );
  };
  useEffect(() => {
    scrollTo(ctrRef);
  }, [JSON.stringify(messages)]);
  const { theme } = useEnvironment();

  return (
    <ul className="pks_group [&_.feedback-btn]:pks_hidden [&_.message-cntnt:last-of-type_.feedback-btn]:pks_flex pks_list-none pks_flex pks_flex-col pks_justify-end ">
      <li className="message-cntnt pks_flex pks_items-start pks_space-x-2 pks_mb-4 pks_px-4">
        <div className="pks_flex-shrink-0">
          <div
            style={{
              background: theme.color,
            }}
            className="pks_w-10 pks_h-10 pks_rounded-full pks_overflow-hidden pks_p-2"
          >
            <img
              className="pks_w-full pks_h-full pks_object-cover pks_rounded-full"
              alt={deployment.name}
              src={deployment.url}
            />
          </div>
        </div>
        <div className="pks_flex pks_flex-col">
          <div className="pks_flex pks_items-center pks_gap-2">
            <span className="pks_text-gray-500 pks_mb-0.5 pks_text-[13px] pks_font-semibold">
              {deployment.name}
            </span>
          </div>
          <div className="pks_text-[14px] pks_relative">
            <div
              style={{
                left: "-10px",
                background: theme.color,
              }}
              className="pks_bottom-[0px] pks_rounded-[20px] pks_absolute pks_w-6 pks_h-6"
            />
            <div
              style={{
                left: "-16px",
              }}
              className="pks_bottom-[8px] -pks_left-[16px] pks_rounded-[40px] pks_absolute pks_bg-gray-100 pks_w-6 pks_h-6"
            />

            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                background: theme.color,
              }}
              className="pks_text-white pks_px-3 pks_py-2 pks_rounded-2xl pks_w-fit pks_relative"
            >
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.1,
                    },
                  },
                }}
                className={cn(
                  "pks_w-fit text-md",
                  "[&_:is([data-link],a:link,a:visited,a:hover,a:active)]:pks_text-primary",
                  "[&_:is([data-link],a:link,a:visited,a:hover,a:active):hover]:pks_underline",
                  "[&_:is(code,div[data-lang])]:pks_font-mono",
                  "[&_:is(code,div[data-lang])]:pks_bg-overlay",
                  "[&_:is(code,div[data-lang])]:pks_rounded-sm",
                  "[&_:is(code)]:pks_p-0.5",
                  "[&_div[data-lang]]:pks_p-2",
                  "[&_div[data-lang]]:pks_overflow-auto",
                  "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h4,h5,h6,hr):not(:first-child)]:pks_mt-2",
                  "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h3,h4,h5,h6,hr):not(:last-child)]:pks_mb-2",
                  "[&_:is(ul,ol)]:pks_pl-5",
                  "[&_ul]:pks_list-disc",
                  "[&_ol]:pks_list-decimal",
                  "[&_ol>li>ol]:pks_list-[lower-alpha]",
                  "[&_ol>li>ol>li>ol]:pks_list-[lower-roman]",
                  "[&_ol>li>ol>li>ol>li>ol]:pks_list-[list-decimal]",
                  "[&_:is(strong,h1,h2,h3,h4,h5,h6)]:pks_font-semibold",
                  "[&_:is(h1)]:pks_text-2xl",
                  "[&_:is(h2)]:pks_text-lg",
                  "[&_:is(li)]:pks_py-0",
                  "[&_:is(h3)]:pks_text-md",
                  "[&_h1:not(:first-child)]:pks_mt-8",
                  "[&_h1:not(:last-child)]:pks_mb-6",
                  "[&_h2:not(:first-child)]:pks_mt-6",
                  "[&_h2:not(:last-child)]:pks_mb-4",
                  "[&_h3:not(:first-child)]:pks_mt-4",
                  "[&_li::marker]:pks_inline-block",
                  "[&_li::marker]:pks_align-top",
                  "pks_break-words",
                  "pks_leading-7"
                )}
              >
                <ReactMarkdown>{deployment.greeting}</ReactMarkdown>
              </motion.div>
            </motion.div>
          </div>
          <div className="pks_flex pks_flex-col pks_space-y-2 pks_mt-2">
            {deployment.suggestionList.map((x, idx) => {
              return (
                <div
                  key={`suggestion-key-${idx}`}
                  style={{
                    borderColor: theme.color,
                    color: theme.color,
                  }}
                  onClick={() => {
                    ctx?.onSendText(x);
                  }}
                  className="pks_backdrop-blur pks_bg-white pks_flex pks_items-center pks_justify-center pks_px-4 pks_py-2 pks_rounded-full pks_w-fit pks_border-[0.5px] pks_text-ms pks_text-sm hover:pks_bg-white/30 pks_font-medium pks_cursor-pointer"
                >
                  <span className="pks_mr-1 pks_opacity-80">{x}</span>
                  <ArrowRight
                    className="pks_w-4 pks_h-4 pks_shrink-0"
                    strokeWidth={1}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </li>

      {messages.map((chat, idx) => (
        <MessageContent
          key={`msg-idx-${idx}`}
          message={chat}
          deployment={deployment}
        />
      ))}
      <li className="">
        <div ref={ctrRef} />
      </li>
    </ul>
  );
};

export const MessageContent: FC<{
  deployment: AgentWebpluginDeployment;
  message: Message;
}> = ({ deployment, message }) => {
  const { theme } = useEnvironment();
  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  return message.role === MessageRole.User ? (
    <li className="message-cntnt pks_flex pks_items-end pks_justify-end pks_space-x-2 pks_mb-4 pks_px-4">
      <div className="pks_flex pks_w-full pks_items-end pks_flex-col pks_space-y-1 pks_text-[14px] pks_relative">
        <div
          style={{
            right: "-10px",
          }}
          className="pks_bottom-[0px] pks_rounded-[20px] pks_absolute pks_bg-gray-300 pks_w-6 pks_h-6"
        />
        <div
          style={{
            right: "-16px",
          }}
          className="pks_bottom-[8px] pks_rounded-[40px] pks_absolute pks_bg-gray-100 pks_w-6 pks_h-6"
        />
        {message.messages.map((x, idx) => {
          return (
            <AnimatePresence key={`idx-msg-${idx}`}>
              <motion.div
                key={`user-msg-${idx}`}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="pks_bg-gray-300 pks_px-3 pks_py-2 pks_rounded-2xl pks_w-fit pks_relative"
              >
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.1,
                      },
                    },
                  }}
                  key={idx}
                  className={cn(
                    "pks_w-fit text-md",
                    "[&_:is([data-link],a:link,a:visited,a:hover,a:active)]:pks_text-primary",
                    "[&_:is([data-link],a:link,a:visited,a:hover,a:active):hover]:pks_underline",
                    "[&_:is(code,div[data-lang])]:pks_font-mono",
                    "[&_:is(code,div[data-lang])]:pks_bg-overlay",
                    "[&_:is(code,div[data-lang])]:pks_rounded-sm",
                    "[&_:is(code)]:pks_p-0.5",
                    "[&_div[data-lang]]:pks_p-2",
                    "[&_div[data-lang]]:pks_overflow-auto",
                    "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h4,h5,h6,hr):not(:first-child)]:pks_mt-2",
                    "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h3,h4,h5,h6,hr):not(:last-child)]:pks_mb-2",
                    "[&_:is(ul,ol)]:pks_pl-5",
                    "[&_ul]:pks_list-disc",
                    "[&_ol]:pks_list-decimal",
                    "[&_ol>li>ol]:pks_list-[lower-alpha]",
                    "[&_ol>li>ol>li>ol]:pks_list-[lower-roman]",
                    "[&_ol>li>ol>li>ol>li>ol]:pks_list-[list-decimal]",
                    "[&_:is(strong,h1,h2,h3,h4,h5,h6)]:pks_font-semibold",
                    "[&_:is(h1)]:pks_text-2xl",
                    "[&_:is(h2)]:pks_text-lg",
                    "[&_:is(li)]:pks_py-0",
                    "[&_:is(h3)]:pks_text-md",
                    "[&_h1:not(:first-child)]:pks_mt-8",
                    "[&_h1:not(:last-child)]:pks_mb-6",
                    "[&_h2:not(:first-child)]:pks_mt-6",
                    "[&_h2:not(:last-child)]:pks_mb-4",
                    "[&_h3:not(:first-child)]:pks_mt-4",
                    "[&_li::marker]:pks_inline-block",
                    "[&_li::marker]:pks_align-top",
                    "pks_break-words",
                    "pks_leading-7"
                  )}
                >
                  <ReactMarkdown>{x}</ReactMarkdown>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </li>
  ) : (
    <li className="message-cntnt pks_flex pks_items-start pks_space-x-2 pks_mb-4 pks_px-4">
      <div className="pks_flex-shrink-0">
        <div
          style={{
            background: theme.color,
          }}
          className="pks_w-10 pks_h-10 pks_rounded-full pks_overflow-hidden pks_p-2"
        >
          <img
            className="pks_w-full pks_h-full pks_object-cover pks_rounded-full"
            alt={deployment.name}
            src={deployment.url}
          />
        </div>
      </div>
      <div className="pks_flex pks_flex-col">
        <div className="pks_flex pks_items-center pks_gap-2">
          <span className="pks_text-gray-500 pks_mb-0.5 pks_text-[13px]">
            {deployment.name}
          </span>

          <span
            className={cn(
              message.status == MessageStatus.Complete && "pks_hidden"
            )}
          >
            <DotLoader
              style={{
                background: theme.color,
              }}
            />
          </span>
        </div>

        <div className="pks_space-y-1 pks_text-[14px] pks_relative">
          <div
            style={{
              left: "-10px",
              background: theme.color,
            }}
            className="pks_bottom-[0px] pks_rounded-[20px] pks_absolute pks_w-6 pks_h-6"
          />
          <div
            style={{
              left: "-16px",
            }}
            className="pks_bottom-[8px] -pks_left-[16px] pks_rounded-[40px] pks_absolute pks_bg-gray-100 pks_w-6 pks_h-6"
          />
          {message.messages.map((x, idx) => {
            return (
              <AnimatePresence key={`idx-msg-${idx}`}>
                <motion.div
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={`system-msg-${idx}`}
                  style={{
                    background: theme.color,
                  }}
                  className="pks_text-white pks_px-3 pks_py-2 pks_rounded-2xl pks_w-fit pks_relative"
                >
                  <motion.div
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 20,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.1,
                        },
                      },
                    }}
                    key={idx}
                    className={cn(
                      "pks_w-fit text-md",
                      "[&_:is([data-link],a:link,a:visited,a:hover,a:active)]:pks_text-primary",
                      "[&_:is([data-link],a:link,a:visited,a:hover,a:active):hover]:pks_underline",
                      "[&_:is(code,div[data-lang])]:pks_font-mono",
                      "[&_:is(code,div[data-lang])]:pks_bg-overlay",
                      "[&_:is(code,div[data-lang])]:pks_rounded-sm",
                      "[&_:is(code)]:pks_p-0.5",
                      "[&_div[data-lang]]:pks_p-2",
                      "[&_div[data-lang]]:pks_overflow-auto",
                      "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h4,h5,h6,hr):not(:first-child)]:pks_mt-2",
                      "[&_:is(p,ul,ol,dl,table,blockquote,div[data-lang],h3,h4,h5,h6,hr):not(:last-child)]:pks_mb-2",
                      "[&_:is(ul,ol)]:pks_pl-5",
                      "[&_ul]:pks_list-disc",
                      "[&_ol]:pks_list-decimal",
                      "[&_ol>li>ol]:pks_list-[lower-alpha]",
                      "[&_ol>li>ol>li>ol]:pks_list-[lower-roman]",
                      "[&_ol>li>ol>li>ol>li>ol]:pks_list-[list-decimal]",
                      "[&_:is(strong,h1,h2,h3,h4,h5,h6)]:pks_font-semibold",
                      "[&_:is(h1)]:pks_text-2xl",
                      "[&_:is(h2)]:pks_text-lg",
                      "[&_:is(li)]:pks_py-0",
                      "[&_:is(h3)]:pks_text-md",
                      "[&_h1:not(:first-child)]:pks_mt-8",
                      "[&_h1:not(:last-child)]:pks_mb-6",
                      "[&_h2:not(:first-child)]:pks_mt-6",
                      "[&_h2:not(:last-child)]:pks_mb-4",
                      "[&_h3:not(:first-child)]:pks_mt-4",
                      "[&_li::marker]:pks_inline-block",
                      "[&_li::marker]:pks_align-top",
                      "pks_break-words",
                      "pks_leading-7"
                    )}
                  >
                    <ReactMarkdown>{x}</ReactMarkdown>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>
      </div>
    </li>
  );
};
