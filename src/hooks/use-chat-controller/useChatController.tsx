import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AssistantWebpluginDeployment,
  Channel,
  useAgentMessages,
  VoiceAgent,
} from "@rapidaai/react";
import {
  BusEventViewChange,
  CarbonTheme as AiChatTheme,
  ChatContainerProps,
  ChatInstance,
  CornersType,
  MinimizeButtonIconType,
  RenderWriteableElementResponse,
} from "@carbon/ai-chat";
import { applyCarbonInputStyles } from "@/adapters/carbon/apply-input-styles";
import { AudioControls } from "@/components/audio/audio-controls/AudioControls";
import { useAudioControls } from "@/hooks/use-audio-controls/useAudioControls";
import { useCarbonInputHasText } from "@/hooks/use-carbon-input/useCarbonInputHasText";
import { useMessageSync } from "@/hooks/use-message-sync/useMessageSync";
import { useVoiceTranscript } from "@/hooks/use-voice-transcript/useVoiceTranscript";
import {
  getCustomElementShellStyle,
  getThemeLayoutProperties,
  resolveLayoutSettings,
} from "@/lib/layout/layout";
import type { ChatbotConfig } from "@/types/widget";

const PANEL_WIDTH = "min(100vw, 450px)";

export interface UseChatControllerOptions {
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
  config?: ChatbotConfig;
  environmentThemeMode?: "light" | "dark" | "system";
}

export function useChatController({
  deployment,
  voiceAgent,
  config,
  environmentThemeMode,
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
  const { mode: layout, position, aiChatLayout } =
    resolveLayoutSettings(layoutSettings);
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
  const hasText = useCarbonInputHasText(chatInstance);

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

  const renderWriteableElements = useMemo<RenderWriteableElementResponse>(
    () => ({
      ...aiChatConfig.renderWriteableElements,
      afterInputElement: (
        <>
          {showInputControls && (
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
          )}
          {aiChatConfig.renderWriteableElements?.afterInputElement}
        </>
      ),
    }),
    [
      aiChatConfig.renderWriteableElements,
      audioControls,
      channel,
      chatInstance,
      hasText,
      isInputDisabled,
      showInputControls,
      voiceEnabled,
      voiceTranscript,
    ],
  );

  const chatProps = useMemo<ChatContainerProps>(() => {
    const defaults: ChatContainerProps = {
      aiEnabled: false,
      assistantName: displayName,
      assistantAvatarUrl: logoUrl,
      debug: aiChatConfig.debug,
      injectCarbonTheme:
        injectTheme ??
        (themeMode === "dark"
          ? AiChatTheme.G100
          : themeMode === "light"
            ? AiChatTheme.G10
            : undefined),
      locale: language,
      namespace: "rapida-chat",
      openChatByDefault: isCustomElement,
      shouldSanitizeHTML: true,
      shouldTakeFocusIfOpensAutomatically: false,
      header: {
        title: displayName,
        showAiLabel: false,
        hideDefaultAiLabelContent: true,
        showRestartButton: true,
        minimizeButtonIconType: MinimizeButtonIconType.MINIMIZE,
      },
      history: { isOn: false },
      launcher: {
        isOn: layout === "floating",
      },
      layout: {
        corners: CornersType.SQUARE,
        showFrame: true,
        customProperties: getThemeLayoutProperties(layout, position),
      },
      messaging: {
        messageTimeoutSecs: 150,
        messageLoadingIndicatorTimeoutSecs: 1,
      },
    };
    const resolvedInjectTheme =
      injectTheme ?? aiChatConfig.injectCarbonTheme ?? defaults.injectCarbonTheme;

    return {
      ...defaults,
      ...aiChatConfig,
      injectCarbonTheme: resolvedInjectTheme,
      header: { ...defaults.header, ...aiChatConfig.header },
      history: { ...defaults.history, ...aiChatConfig.history },
      launcher: { ...defaults.launcher, ...aiChatConfig.launcher },
      layout: {
        ...defaults.layout,
        ...aiChatLayout,
        customProperties: {
          ...defaults.layout?.customProperties,
          ...aiChatLayout?.customProperties,
        },
      },
      input: {
        ...aiChatConfig.input,
        isDisabled: isInputDisabled,
        isVisible: showInputControls && channel !== Channel.Audio,
      },
      messaging: {
        ...defaults.messaging,
        ...aiChatConfig.messaging,
        customSendMessage,
      },
      onBeforeRender,
      onViewChange,
      renderWriteableElements,
    };
  }, [
    aiChatConfig,
    aiChatLayout,
    channel,
    customSendMessage,
    displayName,
    injectTheme,
    isCustomElement,
    isInputDisabled,
    language,
    layout,
    logoUrl,
    onBeforeRender,
    onViewChange,
    position,
    renderWriteableElements,
    showInputControls,
    themeMode,
  ]);

  return {
    chatProps,
    isCustomElement,
    shellStyle: getCustomElementShellStyle(layout, dockSide, customElementOpen),
  };
}
