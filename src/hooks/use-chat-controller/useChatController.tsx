import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AssistantWebpluginDeployment,
  Channel,
  useAgentMessages,
  VoiceAgent,
} from "@rapidaai/react";
import {
  BusEventViewChange,
  BusEventType,
  ChatInstance,
  HistoryItem,
  TypeAndHandler,
} from "@carbon/ai-chat";
import { applyCarbonInputStyles } from "@/adapters/carbon";
import { AudioControls } from "@/components/audio";
import {
  ConversationHistoryPanel,
  RestartConversationPanel,
} from "@/components/chat";
import { useAudioControls } from "@/hooks/use-audio-controls";
import { useAgentError } from "@/hooks/use-agent-error";
import { useCarbonInputHasText } from "@/hooks/use-carbon-input";
import { useChatProps } from "@/hooks/use-chat-props";
import { useConversationPanels } from "@/hooks/use-conversation-panels";
import type { ConversationHistoryState } from "@/hooks/use-conversation-history";
import { useMessageSync } from "@/hooks/use-message-sync";
import { useVoiceTranscript } from "@/hooks/use-voice-transcript";
import {
  getCustomElementShellStyle,
  resolveLayoutSettings,
} from "@/lib/layout";
import type { ChatbotConfig } from "@/types";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";

const PANEL_WIDTH = "min(100vw, 450px)";

export interface UseChatControllerOptions {
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  environmentThemeMode?: "light" | "dark" | "system";
  conversationHistory?: ConversationHistoryState;
  initialHistory?: HistoryItem[];
  onRestartConversation?: () => unknown;
  onSelectConversation?: (entry: ConversationHistoryEntry) => Promise<void>;
}

export function useChatController({
  deployment,
  voiceAgent,
  config,
  environmentThemeMode,
  conversationHistory,
  initialHistory = [],
  onRestartConversation,
  onSelectConversation,
}: UseChatControllerOptions) {
  const {
    assistant_id: _assistantId,
    assistant_version: _assistantVersion,
    api_base: _apiBase,
    token: _token,
    language,
    user: _user,
    name,
    logo_url: logoUrl,
    layout: layoutSettings,
    theme: themeSettings,
    ...aiChatConfig
  } = config ?? {};
  const {
    mode: configThemeMode,
    injectTheme,
  } = themeSettings ?? {};
  const resolvedLayout = resolveLayoutSettings(layoutSettings);
  const { mode: layout } = resolvedLayout;
  const displayName = name || deployment.getName() || "Assistant";
  const themeMode = environmentThemeMode || configThemeMode || "light";
  const voiceEnabled =
    Boolean(deployment.getInputaudio()) && Boolean(deployment.getOutputaudio());
  const isDocked = layout === "docked-right" || layout === "docked-left";
  const isCustomElement = isDocked || layout === "inline";
  const dockSide = layout === "docked-left" ? "left" : "right";
  const isInputDisabled = Boolean(aiChatConfig.input?.isDisabled);
  const showInputControls = aiChatConfig.input?.isVisible !== false;
  const audioControls = useAudioControls(voiceAgent);
  const { channel } = audioControls;
  const { messages } = useAgentMessages(voiceAgent);
  const voiceTranscript = useVoiceTranscript(messages, channel);
  const [customElementOpen, setCustomElementOpen] = useState(
    aiChatConfig.openChatByDefault ?? isCustomElement,
  );
  const { chatInstance, registerChatInstance, customSendMessage } =
    useMessageSync({
      deployment,
      voiceAgent,
      channel,
      messages,
      inputDisabled: isInputDisabled,
      initialHistory,
    });
  const agentError = useAgentError(voiceAgent);
  const ownsCatastrophicPanel = useRef(false);
  const hasText = useCarbonInputHasText(chatInstance);
  const stopVoiceBeforeRestart = useCallback(async () => {
    if (audioControls.isConnected || audioControls.isConnecting) {
      await audioControls.stopVoice();
    }
  }, [audioControls]);
  const conversationPanels = useConversationPanels({
    chatInstance,
    onBeforeRestart: stopVoiceBeforeRestart,
    onAfterRestart: onRestartConversation,
    onOpenHistory: conversationHistory?.refresh,
    onSelectConversation,
  });

  useEffect(() => {
    if (!isDocked) return;
    const marginKey = dockSide === "right" ? "marginRight" : "marginLeft";
    const previousMargin = document.body.style[marginKey];
    document.body.style[marginKey] = customElementOpen ? PANEL_WIDTH : "";
    return () => {
      document.body.style[marginKey] = previousMargin;
    };
  }, [isDocked, dockSide, customElementOpen]);

  const onBeforeRender = useCallback(
    async (instance: ChatInstance) => {
      registerChatInstance(instance);
      applyCarbonInputStyles();
      await aiChatConfig.onBeforeRender?.(instance);
    },
    [aiChatConfig, registerChatInstance],
  );

  const onViewChange = useCallback(
    (event: BusEventViewChange, instance: ChatInstance) => {
      setCustomElementOpen(Boolean(event.newViewState.mainWindow));
      aiChatConfig.onViewChange?.(event, instance);
    },
    [aiChatConfig],
  );

  useEffect(() => applyCarbonInputStyles(), [chatInstance, isInputDisabled]);

  useEffect(() => {
    if (!chatInstance) return;

    if (agentError) {
      ownsCatastrophicPanel.current = true;
      chatInstance.updateCatastrophicErrorPanel({
        isOpen: true,
        title: "Unable to connect",
        bodyText: agentError,
      });
      return;
    }

    if (ownsCatastrophicPanel.current) {
      ownsCatastrophicPanel.current = false;
      chatInstance.updateCatastrophicErrorPanel({ isOpen: false });
    }
  }, [agentError, chatInstance]);

  useEffect(() => {
    if (!chatInstance) return;
    const retryHandler: TypeAndHandler = {
      type: BusEventType.RESTART_CONVERSATION,
      handler: () => {
        if (!ownsCatastrophicPanel.current) return;
        ownsCatastrophicPanel.current = false;
        if (onRestartConversation) {
          void onRestartConversation();
        } else {
          void voiceAgent.connect();
        }
      },
    };
    chatInstance.on(retryHandler);
    return () => {
      chatInstance.off(retryHandler);
    };
  }, [chatInstance, onRestartConversation, voiceAgent]);

  const inputControls = useMemo(
    () => (
      <AudioControls
        channel={channel}
        voiceEnabled={voiceEnabled}
        hasText={hasText}
        transcript={voiceTranscript}
        disabled={isInputDisabled}
        isConnected={audioControls.isConnected}
        isConnecting={audioControls.isConnecting}
        isMuted={audioControls.isMuted}
        frequencies={audioControls.frequencies}
        devices={audioControls.devices}
        activeDeviceId={audioControls.activeDeviceId}
        onStartVoice={audioControls.startVoice}
        onToggleMute={audioControls.toggleMute}
        onSwitchToText={audioControls.switchToText}
        onStop={audioControls.stopVoice}
        onDeviceChange={audioControls.selectDevice}
      />
    ),
    [
      audioControls,
      channel,
      hasText,
      isInputDisabled,
      voiceEnabled,
      voiceTranscript,
    ],
  );

  const restartPanelElement = useMemo(
    () => (
      <RestartConversationPanel
        isRestarting={conversationPanels.isRestarting}
        onCancel={conversationPanels.closeRestartPanel}
        onConfirm={conversationPanels.confirmRestart}
      />
    ),
    [conversationPanels],
  );
  const historyPanelElement = useMemo(
    () => (
      <ConversationHistoryPanel
        entries={conversationHistory?.entries ?? []}
        isLoading={conversationHistory?.isLoading ?? false}
        isLoadingMore={conversationHistory?.isLoadingMore ?? false}
        restoringConversationId={
          conversationHistory?.restoringConversationId ?? null
        }
        hasMore={conversationHistory?.hasMore ?? false}
        error={conversationHistory?.error ?? null}
        onClose={conversationPanels.closeHistoryPanel}
        onNewConversation={conversationPanels.startConversationFromHistory}
        onSearch={conversationHistory?.search}
        onLoadMore={conversationHistory?.loadMore}
        onSelectConversation={conversationPanels.selectConversation}
      />
    ),
    [conversationHistory, conversationPanels],
  );

  const chatProps = useChatProps({
    config: aiChatConfig,
    displayName,
    logoUrl,
    language,
    themeMode,
    injectTheme,
    layout: resolvedLayout,
    isCustomElement,
    inputDisabled: isInputDisabled,
    inputControlsVisible: showInputControls,
    channel,
    customSendMessage,
    onBeforeRender,
    onViewChange,
    inputControls,
    isRestartPanelOpen: conversationPanels.isRestartPanelOpen,
    restartPanelElement,
    historyPanelElement,
    onOpenRestartPanel: conversationPanels.openRestartPanel,
    onOpenHistoryPanel: conversationPanels.openHistoryPanel,
  });

  return {
    chatProps,
    isCustomElement,
    shellStyle: getCustomElementShellStyle(layout, dockSide, customElementOpen),
  };
}
