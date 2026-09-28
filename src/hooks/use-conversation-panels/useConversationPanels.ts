import { useCallback, useEffect, useState } from "react";
import {
  BusEventType,
  ChatInstance,
  PanelType,
  TypeAndHandler,
} from "@carbon/ai-chat";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";

export interface UseConversationPanelsOptions {
  chatInstance: ChatInstance | null;
  onBeforeRestart?: () => unknown | Promise<unknown>;
  onAfterRestart?: () => unknown | Promise<unknown>;
  onOpenHistory?: () => unknown | Promise<unknown>;
  onSelectConversation?: (entry: ConversationHistoryEntry) => Promise<void>;
}

export function useConversationPanels({
  chatInstance,
  onBeforeRestart,
  onAfterRestart,
  onOpenHistory,
  onSelectConversation,
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
    await onOpenHistory?.();
  }, [chatInstance, onOpenHistory]);

  const closeHistoryPanel = useCallback(async () => {
    await chatInstance?.customPanels?.getPanel(PanelType.HISTORY).close();
  }, [chatInstance]);

  const startConversationFromHistory = useCallback(async () => {
    await closeHistoryPanel();
    await openRestartPanel();
  }, [closeHistoryPanel, openRestartPanel]);

  const selectConversation = useCallback(async (
    entry: ConversationHistoryEntry,
  ) => {
    if (!onSelectConversation) return;
    await onBeforeRestart?.();
    await onSelectConversation(entry);
    await closeHistoryPanel();
  }, [closeHistoryPanel, onBeforeRestart, onSelectConversation]);

  return {
    isRestartPanelOpen,
    isRestarting,
    openRestartPanel,
    closeRestartPanel,
    confirmRestart,
    openHistoryPanel,
    closeHistoryPanel,
    startConversationFromHistory,
    selectConversation,
  };
}
