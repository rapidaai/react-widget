import { ReactNode, useMemo } from "react";
import { Channel } from "@rapidaai/react";
import { RecentlyViewed, Restart } from "@carbon/icons-react";
import {
  CarbonTheme as AiChatTheme,
  ChatContainerProps,
  CornersType,
  MinimizeButtonIconType,
  RenderWriteableElementResponse,
} from "@carbon/ai-chat";
import {
  getThemeLayoutProperties,
  ResolvedLayoutSettings,
} from "@/lib/layout";
import type { AiChatConfig } from "@/types";

export interface UseChatPropsOptions {
  config: AiChatConfig;
  displayName: string;
  logoUrl?: string;
  language?: string;
  themeMode: "light" | "dark" | "system";
  injectTheme?: ChatContainerProps["injectCarbonTheme"];
  layout: ResolvedLayoutSettings;
  isCustomElement: boolean;
  inputDisabled: boolean;
  inputControlsVisible: boolean;
  channel: Channel;
  customSendMessage: NonNullable<
    NonNullable<ChatContainerProps["messaging"]>["customSendMessage"]
  >;
  onBeforeRender: NonNullable<ChatContainerProps["onBeforeRender"]>;
  onViewChange: NonNullable<ChatContainerProps["onViewChange"]>;
  inputControls: ReactNode;
  isRestartPanelOpen: boolean;
  restartPanelElement: ReactNode;
  historyPanelElement: ReactNode;
  onOpenRestartPanel: () => unknown;
  onOpenHistoryPanel: () => unknown;
}

export function useChatProps({
  config,
  displayName,
  logoUrl,
  language,
  themeMode,
  injectTheme,
  layout,
  isCustomElement,
  inputDisabled,
  inputControlsVisible,
  channel,
  customSendMessage,
  onBeforeRender,
  onViewChange,
  inputControls,
  isRestartPanelOpen,
  restartPanelElement,
  historyPanelElement,
  onOpenRestartPanel,
  onOpenHistoryPanel,
}: UseChatPropsOptions): ChatContainerProps {
  const historyEnabled = config.history?.isOn !== false;
  const restartEnabled = config.header?.showRestartButton !== false;
  const renderWriteableElements =
    useMemo<RenderWriteableElementResponse>(() => ({
      ...config.renderWriteableElements,
      afterInputElement: (
        <>
          {inputControlsVisible && inputControls}
          {config.renderWriteableElements?.afterInputElement}
        </>
      ),
      customPanelElement: isRestartPanelOpen
        ? restartPanelElement
        : config.renderWriteableElements?.customPanelElement,
      historyPanelElement:
        config.renderWriteableElements?.historyPanelElement ??
        historyPanelElement,
    }), [
      config.renderWriteableElements,
      historyPanelElement,
      inputControls,
      inputControlsVisible,
      isRestartPanelOpen,
      restartPanelElement,
    ]);

  return useMemo<ChatContainerProps>(() => {
    const defaults: ChatContainerProps = {
      aiEnabled: false,
      assistantName: displayName,
      assistantAvatarUrl: logoUrl,
      debug: config.debug,
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
        showRestartButton: false,
        minimizeButtonIconType: MinimizeButtonIconType.MINIMIZE,
        actions: [
          ...(config.header?.actions ?? []),
          ...(historyEnabled
            ? [{
                text: "Chat history",
                icon: RecentlyViewed,
                fixed: true,
                onClick: () => void onOpenHistoryPanel(),
              }]
            : []),
          ...(restartEnabled
            ? [{
                text: "Restart conversation",
                icon: Restart,
                fixed: true,
                onClick: () => void onOpenRestartPanel(),
              }]
            : []),
        ],
      },
      history: {
        isOn: historyEnabled,
        showMobileMenu: false,
        startClosed: true,
      },
      launcher: { isOn: layout.mode === "floating" },
      layout: {
        corners: CornersType.SQUARE,
        showFrame: true,
        customProperties: getThemeLayoutProperties(
          layout.mode,
          layout.position,
        ),
      },
      messaging: {
        messageTimeoutSecs: 150,
        messageLoadingIndicatorTimeoutSecs: 1,
      },
    };
    const resolvedInjectTheme =
      injectTheme ?? config.injectCarbonTheme ?? defaults.injectCarbonTheme;

    return {
      ...defaults,
      ...config,
      injectCarbonTheme: resolvedInjectTheme,
      header: {
        ...defaults.header,
        ...config.header,
        showRestartButton: false,
        actions: defaults.header?.actions,
      },
      history: { ...defaults.history, ...config.history },
      launcher: { ...defaults.launcher, ...config.launcher },
      layout: {
        ...defaults.layout,
        ...layout.aiChatLayout,
        customProperties: {
          ...defaults.layout?.customProperties,
          ...layout.aiChatLayout?.customProperties,
        },
      },
      input: {
        ...config.input,
        isDisabled: inputDisabled,
        isVisible: inputControlsVisible && channel !== Channel.Audio,
      },
      messaging: {
        ...defaults.messaging,
        ...config.messaging,
        customSendMessage,
      },
      onBeforeRender,
      onViewChange,
      renderWriteableElements,
    };
  }, [
    channel,
    config,
    customSendMessage,
    displayName,
    historyEnabled,
    injectTheme,
    inputControlsVisible,
    inputDisabled,
    isCustomElement,
    onOpenHistoryPanel,
    onOpenRestartPanel,
    language,
    layout,
    logoUrl,
    onBeforeRender,
    onViewChange,
    renderWriteableElements,
    restartEnabled,
    themeMode,
  ]);
}
