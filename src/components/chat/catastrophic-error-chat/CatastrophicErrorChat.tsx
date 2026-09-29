import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BusEventViewChange,
  BusEventType,
  CarbonTheme as AiChatTheme,
  ChatContainer,
  ChatContainerProps,
  ChatCustomElement,
  ChatInstance,
  CornersType,
  MinimizeButtonIconType,
  TypeAndHandler,
} from "@carbon/ai-chat";
import { applyCarbonInputStyles } from "@/adapters/carbon";
import {
  getCustomElementShellStyle,
  getThemeLayoutProperties,
  resolveLayoutSettings,
} from "@/lib/layout";
import type { ChatbotConfig } from "@/types";

const PANEL_WIDTH = "min(100vw, 450px)";

export interface CatastrophicErrorChatProps {
  error: string;
  config?: ChatbotConfig;
  themeMode?: "light" | "dark" | "system";
  onRetry?: () => unknown;
}

export function CatastrophicErrorChat({
  error,
  config,
  themeMode: environmentThemeMode,
  onRetry,
}: CatastrophicErrorChatProps) {
  const {
    assistant_id: _assistantId,
    assistant_version: _assistantVersion,
    api_base: _apiBase,
    token: _token,
    user: _user,
    name,
    logo_url: logoUrl,
    language,
    layout: layoutSettings,
    theme: themeSettings,
    ...aiChatConfig
  } = config ?? {};
  const layout = resolveLayoutSettings(layoutSettings);
  const isDocked =
    layout.mode === "docked-right" || layout.mode === "docked-left";
  const isCustomElement = isDocked || layout.mode === "inline";
  const dockSide = layout.mode === "docked-left" ? "left" : "right";
  const [isOpen, setIsOpen] = useState(true);
  const themeMode = environmentThemeMode || themeSettings?.mode || "light";
  const displayName = name || "Assistant";

  const retryHandler = useMemo<TypeAndHandler>(() => ({
    type: BusEventType.RESTART_CONVERSATION,
    handler: () => void onRetry?.(),
  }), [onRetry]);

  useEffect(() => {
    if (!isDocked) return;
    const marginKey = dockSide === "right" ? "marginRight" : "marginLeft";
    const previousMargin = document.body.style[marginKey];
    document.body.style[marginKey] = isOpen ? PANEL_WIDTH : "";
    return () => {
      document.body.style[marginKey] = previousMargin;
    };
  }, [dockSide, isDocked, isOpen]);

  const onBeforeRender = useCallback(
    async (instance: ChatInstance) => {
      applyCarbonInputStyles();
      instance.updateCatastrophicErrorPanel({
        isOpen: true,
        title: "Unable to connect",
        bodyText: error,
      });
      instance.on(retryHandler);
      await aiChatConfig.onBeforeRender?.(instance);
    },
    [aiChatConfig, error, retryHandler],
  );

  const onViewChange = useCallback(
    (event: BusEventViewChange, instance: ChatInstance) => {
      setIsOpen(Boolean(event.newViewState.mainWindow));
      aiChatConfig.onViewChange?.(event, instance);
    },
    [aiChatConfig],
  );

  const chatProps = useMemo<ChatContainerProps>(() => ({
    ...aiChatConfig,
    aiEnabled: false,
    assistantName: displayName,
    assistantAvatarUrl: logoUrl,
    injectCarbonTheme:
      themeSettings?.injectTheme ??
      aiChatConfig.injectCarbonTheme ??
      (themeMode === "dark"
        ? AiChatTheme.G100
        : themeMode === "light"
          ? AiChatTheme.G10
          : undefined),
    locale: language,
    namespace: "rapida-chat",
    openChatByDefault: true,
    shouldSanitizeHTML: true,
    shouldTakeFocusIfOpensAutomatically: false,
    header: {
      ...aiChatConfig.header,
      title: displayName,
      showAiLabel: false,
      hideDefaultAiLabelContent: true,
      showRestartButton: false,
      minimizeButtonIconType: MinimizeButtonIconType.MINIMIZE,
      actions: [],
    },
    history: { ...aiChatConfig.history, isOn: false },
    launcher: {
      ...aiChatConfig.launcher,
      isOn: layout.mode === "floating",
    },
    layout: {
      corners: CornersType.SQUARE,
      showFrame: true,
      ...layout.aiChatLayout,
      customProperties: {
        ...getThemeLayoutProperties(layout.mode, layout.position),
        ...layout.aiChatLayout?.customProperties,
      },
    },
    input: {
      ...aiChatConfig.input,
      isDisabled: true,
      isVisible: false,
    },
    onBeforeRender,
    onViewChange,
  }), [
    aiChatConfig,
    displayName,
    language,
    layout,
    logoUrl,
    onBeforeRender,
    onViewChange,
    retryHandler,
    themeMode,
    themeSettings?.injectTheme,
  ]);

  if (!isCustomElement) return <ChatContainer {...chatProps} />;

  return (
    <div style={getCustomElementShellStyle(layout.mode, dockSide, isOpen)}>
      <ChatCustomElement
        {...chatProps}
        className="rapida-theme-chat"
        style={customElementStyle}
      />
    </div>
  );
}

const customElementStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
};
