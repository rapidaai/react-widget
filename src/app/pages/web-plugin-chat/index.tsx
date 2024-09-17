import { GetAssistant } from "@/app/clients/assistant";
import {
  Assistant,
  GetAssistantResponse,
} from "@/app/clients/protos/assistant-api_pb";
import { HEADER_API_KEY } from "@/configs";
import { useEnvironment } from "@/hooks/use-environment";
import { useDebugger, useLogger } from "@/hooks/use-logger";
import { cn } from "@/styles/media";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useCycle } from "framer-motion";
import { Header } from "@/app/components/header-action";
import { FloatButtonIcon } from "@/app/components/float-action-button";
import { HEADER_AUTH_ID } from "@/utils/rapida_header";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import { WelcomePage } from "@/app/pages/web-plugin-chat/welcome-page";
import { ChatPage } from "@/app/pages/web-plugin-chat/chatter-box";
//
//
export const WebPluginChat = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [isExpand, toggelScreen] = useCycle(false, true);
  const { assistantId, assistantVersion, token, user, debug } =
    useEnvironment();
  const [loadingAssistant, setLoadingAssistant] = useState<boolean>(true);

  /**
   *
   */
  const log = useLogger();
  const { dir } = useDebugger();
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(
    null
  );

  /**
   *
   */
  const aftergetassistant = useCallback(
    (err: any | null, gur: GetAssistantResponse | null) => {
      dir(err);
      dir(gur?.toObject());
      setLoadingAssistant(false);
      if (gur?.getSuccess()) {
        log(gur.getData());
        const as = gur.getData();
        if (as) {
          setCurrentAssistant(as);
        }
      } else {
        let errorMessage = gur?.getError();
        if (errorMessage) {
          log(errorMessage.getHumanmessage());
          return;
        }
        log("Unable to get your assistants, please try again later.");
      }
    },
    []
  );

  /**
   *
   */
  useEffect(() => {
    if (!assistantId) {
      console.error(
        "Please provide an assistant_id for initialize the assistant."
      );
      return;
    }
    if (!token) {
      console.error(
        "Please provide an authentication token for initialize the assistant."
      );
      return;
    }

    let assistantProviderModelId = null;
    if (assistantVersion) {
      assistantProviderModelId = assistantVersion;
    }
    // x-api-key
    GetAssistant(assistantId, assistantProviderModelId, aftergetassistant, {
      [HEADER_API_KEY]: token,
      [HEADER_AUTH_ID]: user.user_id,
    });
  }, [assistantId]);

  return (
    <motion.div>
      <AnimatePresence>
        {currentAssistant && isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              isExpand
                ? "pks_bg-gray-500/5 pks_dark:bg-slate-400/5 pks_backdrop-blur-sm pks_p-8 pks_fixed pks_inset-0 pks_z-50 pks_grid pks_place-items-center pks_overflow-y-scroll"
                : "pks_fixed pks_bottom-0 pks_right-0 dark:pks_text-gray-300 pks_text-gray-700 pks_h-fit pks_w-fit pks_p-3 pks_bg-gradient-to-br pks_from-white pks_via-transparent pks_to-gray-600/10 pks_bg-opacity-8"
            )}
          >
            <MemoryRouter initialEntries={["/messages"]}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <motion.div
                      layout
                      animate={isExpand}
                      className={cn(
                        "pks_shadow pks_border-[0.5px]",

                        isExpand
                          ? "pks_w-1/2 pks_h-[700px] pks_max-h-full"
                          : "pks_w-[500px] pks_h-[700px] pks_max-h-full",
                        "pks_flex pks_flex-col",
                        "pks_bg-[linear-gradient(103deg,_var(--tw-gradient-stops))]",
                        " pks_from-gray-200/50 dark:pks_from-gray-950",
                        "pks_via-blue-600/5 dark:pks_via-slate-800",
                        "pks_via-blue-600/10 dark:pks_to-slate-950/80",

                        "pks_mb-28 pks_mr-4",
                        "pks_shadow-lg",
                        "pks_border pks_rounded-xl"
                      )}
                    >
                      <Header
                        isMaximize={isExpand}
                        toggelScreen={toggelScreen}
                        toggleOpen={toggleOpen}
                      />
                      <Outlet />
                    </motion.div>
                  }
                >
                  <Route
                    path="messages"
                    element={
                      <WelcomePage currentAssistant={currentAssistant} />
                    }
                  />
                  <Route
                    path="message/:conversationId"
                    element={<ChatPage currentAssistant={currentAssistant} />}
                  />
                  <Route path="help" element={<>Cool</>} />
                </Route>
              </Routes>
            </MemoryRouter>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div
        onClick={() => {
          toggleOpen();
        }}
        className={cn(
          "pks_z-10",
          "pks_fixed pks_bottom-8 pks_right-4",
          "pks_h-16 pks_w-16"
        )}
      >
        <AnimatePresence>
          <FloatButtonIcon
            isOpen={isOpen}
            loadingAssistant={loadingAssistant}
            appIcon={currentAssistant
              ?.getWebappearance()
              ?.getFieldsMap()
              ?.get("appIcon")
              ?.getStringValue()}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
