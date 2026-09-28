import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AssistantWebpluginDeployment,
  Channel,
  useAgentMessages,
  VoiceAgent,
} from "@rapidaai/react";
import {
  BusEventViewChange,
  ChatInstance,
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
import { useMessageSync } from "@/hooks/use-message-sync";
import { useVoiceTranscript } from "@/hooks/use-voice-transcript";
import {
  getCustomElementShellStyle,
  resolveLayoutSettings,
} from "@/lib/layout";
import { getConversationHistoryEntries } from "@/lib/conversation-history";
import type { ChatbotConfig } from "@/types";
import type { ConversationHistoryEntry } from "@/lib/conversation-history";

const PANEL_WIDTH = "min(100vw, 450px)";

export interface UseChatControllerOptions {
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  environmentThemeMode?: "light" | "dark" | "system";
  conversationHistory?: ConversationHistoryEntry[];
  onRestartConversation?: (entry?: ConversationHistoryEntry) => unknown;
}

export function useChatController({
  deployment,
  voiceAgent,
  config,
  environmentThemeMode,
  conversationHistory = [],
  onRestartConversation,
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
    });
  const agentError = useAgentError(voiceAgent);
  const ownsCatastrophicPanel = useRef(false);
  const hasText = useCarbonInputHasText(chatInstance);
  const currentConversationEntry = useMemo(
    () => getConversationHistoryEntries(messages),
    [messages],
  )[0];
  const historyEntries = useMemo(
    () => [
      ...(currentConversationEntry ? [currentConversationEntry] : []),
      ...conversationHistory.filter(
        ({ id }) => id !== currentConversationEntry?.id,
      ),
    ],
    [conversationHistory, currentConversationEntry],
  );
  const stopVoiceBeforeRestart = useCallback(async () => {
    if (audioControls.isConnected || audioControls.isConnecting) {
      await audioControls.stopVoice();
    }
  }, [audioControls]);
  const conversationPanels = useConversationPanels({
    chatInstance,
    onBeforeRestart: stopVoiceBeforeRestart,
    onAfterRestart: () => onRestartConversation?.(currentConversationEntry),
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
        hideRetryButton: true,
      });
      return;
    }

    if (ownsCatastrophicPanel.current) {
      ownsCatastrophicPanel.current = false;
      chatInstance.updateCatastrophicErrorPanel({ isOpen: false });
    }
  }, [agentError, chatInstance]);

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
        entries={historyEntries}
        onClose={conversationPanels.closeHistoryPanel}
        onNewConversation={conversationPanels.startConversationFromHistory}
      />
    ),
    [conversationPanels, historyEntries],
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
