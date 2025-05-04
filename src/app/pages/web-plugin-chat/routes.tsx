import { FC, useState } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { cn } from "@/styles/media";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "@/app/components/header-action";
import { HelpCenterPage } from "@/app/pages/help-center";
import { HelpArticlePage } from "@/app/pages/help-center/help-article";
import { FloatButtonIcon } from "@/app/components/float-action-button";
import { AgentWebpluginDeployment } from "rapida-react";
import { V2 } from "@/app/pages/v2";

export const PluginRouter: FC<{
  deployment: AgentWebpluginDeployment;
}> = ({ deployment }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [isExpand, toggelScreen] = useCycle(false, true);

  return (
    <motion.div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            "pks_z-10",
            isOpen ? "pks_visible" : "pks_invisible",
            isExpand
              ? "pks_bg-gray-500/5 pks_dark:bg-slate-400/5 pks_backdrop-blur-sm pks_fixed pks_inset-0 pks_grid pks_place-items-center pks_overflow-y-scroll dark:pks_text-gray-300 pks_text-gray-700 pks_z-[9999]"
              : "pks_fixed pks_bottom-0 pks_right-0 dark:pks_text-gray-300 pks_text-gray-700 pks_h-fit pks_w-fit pks_bg-gradient-to-br pks_from-transparent pks_via-transparent pks_to-gray-600/10 pks_bg-opacity-8"
          )}
        >
          <MemoryRouter initialEntries={["/chat"]}>
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    layout
                    animate={isExpand}
                    className={cn(
                      "md:pks_border-[0.01px] md:pks_rounded-b-xl md:pks_rounded-t-xl",
                      "pks_shadow pks_w-screen pks_h-[100dvh]",
                      isExpand
                        ? "md:!pks_w-1/2 md:!pks_h-[700px] pks_max-h-full"
                        : "md:!pks_w-[420px] md:!pks_h-[700px] pks_max-h-full",
                      "pks_flex pks_flex-col",
                      "md:pks_mb-28 md:pks_mr-4",
                      "pks_shadow-lg pks_relative"
                    )}
                  >
                    <Header
                      deployment={deployment}
                      isMaximize={isExpand}
                      toggelScreen={toggelScreen}
                      toggleOpen={toggleOpen}
                    />
                    <Outlet />
                  </motion.div>
                }
              >
                <Route path="/chat" element={<V2 deployment={deployment} />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/help/:id" element={<HelpArticlePage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </motion.div>
      </AnimatePresence>
      <div
        onClick={() => {
          toggleOpen();
        }}
        className={cn(
          "pks_fixed pks_bottom-8 pks_right-4 pks_z-50",
          "pks_h-16 pks_w-16",
          isOpen && "pks_hidden md:pks_block"
        )}
      >
        <AnimatePresence>
          <FloatButtonIcon
            isOpen={isOpen}
            loadingAssistant={false}
            appIcon={deployment.url}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
