import { useCallback, useEffect, useState } from "react";
import {
  BusEventType,
  ChatInstance,
  PanelType,
  TypeAndHandler,
} from "@carbon/ai-chat";

export interface UseConversationPanelsOptions {
  chatInstance: ChatInstance | null;
  onBeforeRestart?: () => unknown | Promise<unknown>;
  onAfterRestart?: () => unknown | Promise<unknown>;
}

export function useConversationPanels({
  chatInstance,
  onBeforeRestart,
  onAfterRestart,
}: UseConversationPanelsOptions) {
  const [isRestartPanelOpen, setRestartPanelOpen] = useState(false);
  const [isRestarting, setRestarting] = useState(false);

  useEffect(() => {
    if (!chatInstance) return;
    const closeHandler: TypeAndHandler = {
      type: BusEventType.CUSTOM_PANEL_CLOSE,
      handler: () => setRestartPanelOpen(false),
    };
    chatInstance.on(closeHandler);
    return () => {
      chatInstance.off(closeHandler);
    };
  }, [chatInstance]);

  const closeRestartPanel = useCallback(async () => {
    await chatInstance?.customPanels?.getPanel(PanelType.DEFAULT).close();
    setRestartPanelOpen(false);
  }, [chatInstance]);

  const openRestartPanel = useCallback(async () => {
    if (!chatInstance?.customPanels) return;
    setRestartPanelOpen(true);
    try {
      await chatInstance.customPanels.getPanel(PanelType.DEFAULT).open({
        title: "Restart conversation",
        showFrame: false,
        fullWidth: true,
      });
    } catch (error) {
      setRestartPanelOpen(false);
      throw error;
    }
  }, [chatInstance]);

  const confirmRestart = useCallback(async () => {
    if (!chatInstance || isRestarting) return;
    setRestarting(true);
    try {
      await onBeforeRestart?.();
      await chatInstance.customPanels?.getPanel(PanelType.DEFAULT).close();
      setRestartPanelOpen(false);
      await chatInstance.messaging.restartConversation();
      await onAfterRestart?.();
    } finally {
      setRestarting(false);
    }
  }, [chatInstance, isRestarting, onAfterRestart, onBeforeRestart]);

  const openHistoryPanel = useCallback(async () => {
    await chatInstance?.customPanels?.getPanel(PanelType.HISTORY).open();
  }, [chatInstance]);

  const closeHistoryPanel = useCallback(async () => {
    await chatInstance?.customPanels?.getPanel(PanelType.HISTORY).close();
  }, [chatInstance]);

  const startConversationFromHistory = useCallback(async () => {
    await closeHistoryPanel();
    await openRestartPanel();
  }, [closeHistoryPanel, openRestartPanel]);

  return {
    isRestartPanelOpen,
    isRestarting,
    openRestartPanel,
    closeRestartPanel,
    confirmRestart,
    openHistoryPanel,
    closeHistoryPanel,
    startConversationFromHistory,
  };
}
