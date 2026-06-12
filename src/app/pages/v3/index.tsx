import {
  AssistantWebpluginDeployment,
  Channel,
  useAgentMessages,
  useInputModeToggleAgent,
  VoiceAgent,
} from "@rapidaai/react";
import {
  BusEventViewChange,
  CarbonTheme as AiChatTheme,
  ChatContainer,
  ChatContainerProps,
  ChatCustomElement,
  ChatInstance,
  CornersType,
  LayoutCustomProperties,
  MessageResponse,
  MessageResponseTypes,
  MinimizeButtonIconType,
  OptionItemPreference,
  PublicConfigMessaging,
  RenderWriteableElementResponse,
} from "@carbon/ai-chat";
import {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AudioControls } from "@/app/pages/v3/input";
import { useEnvironment } from "@/hooks/use-environment";

const PANEL_WIDTH = "min(100vw, 450px)";
const FLOATING_PANEL_WIDTH = "min(calc(100vw - 32px), 450px)";
const FLOATING_PANEL_HEIGHT = "min(85dvh, calc(100dvh - 96px))";
const SHELL_OFFSET = "1rem";
const SHELL_Z_INDEX = 9999;
const AI_CHAT_INPUT_STYLE_ID = "rapida-chat-input-style";
const AI_CHAT_INPUT_STYLE = `
  .cds-aichat--input-container {
    border-radius: 0 !important;
    font-size: 12px !important;
  }

  .cds-aichat--input-container [contenteditable="true"],
  .cds-aichat--input-container textarea {
    font-size: inherit !important;
  }
`;

type PendingResponse = {
  resolve: () => void;
  abortHandler: () => void;
  signal: AbortSignal;
};

type WidgetLayoutMode = "floating" | "docked-right" | "docked-left" | "inline";
type WidgetPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
type ThemeSettings = NonNullable<Window["chatbotConfig"]>["theme"];
type LayoutSettings = NonNullable<Window["chatbotConfig"]>["layout"];

type ResolvedLayoutSettings = {
  mode: WidgetLayoutMode;
  position: WidgetPosition;
  showLauncher?: boolean;
  aiChatLayout?: ChatContainerProps["layout"];
};

export const ChatComponent: FC<{
  deployment: AssistantWebpluginDeployment;
  voiceAgent: VoiceAgent;
}> = ({ deployment, voiceAgent }) => {
  const { theme } = useEnvironment();
  const config = window.chatbotConfig;
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
    position: legacyPosition,
    showLauncher: legacyShowLauncher,
    theme: themeSettings,
    ...aiChatConfig
  } = config ?? {};
  const {
    mode: configThemeMode,
    color: _configThemeColor,
    injectTheme,
  } = themeSettings ?? {};
  const {
    mode: layout,
    position,
    showLauncher,
    aiChatLayout,
  } = resolveLayoutSettings(layoutSettings, legacyPosition, legacyShowLauncher);
  const themeMode = theme?.mode || configThemeMode || "light";
  const displayName = name || deployment.getName() || "Assistant";
  const voiceEnabled =
    !!deployment.getInputaudio() && !!deployment.getOutputaudio();

  const isDocked = layout === "docked-right" || layout === "docked-left";
  const isCustomElement = isDocked || layout === "inline";
  const dockSide = layout === "docked-left" ? "left" : "right";
  const { channel } = useInputModeToggleAgent(voiceAgent);
  const { messages } = useAgentMessages(voiceAgent);

  const [customElementOpen, setCustomElementOpen] = useState(
    aiChatConfig.openChatByDefault ?? isCustomElement,
  );
  const [instanceReadyVersion, setInstanceReadyVersion] = useState(0);
  const chatInstanceRef = useRef<ChatInstance | null>(null);
  const seenRapidaMessageIds = useRef<Set<string>>(new Set());
  const pendingResponses = useRef<PendingResponse[]>([]);

  useEffect(() => {
    if (!isDocked) return;

    const marginKey = dockSide === "right" ? "marginRight" : "marginLeft";
    const previousMargin = document.body.style[marginKey];

    document.body.style[marginKey] = customElementOpen ? PANEL_WIDTH : "";

    return () => {
      document.body.style[marginKey] = previousMargin;
    };
  }, [isDocked, dockSide, customElementOpen]);

  const addMessageToChat = useCallback(
    async (message: MessageResponse) => {
      await chatInstanceRef.current?.messaging.addMessage(message);
      const pending = pendingResponses.current.shift();
      if (pending) {
        pending.signal.removeEventListener("abort", pending.abortHandler);
        pending.resolve();
      }
    },
    [],
  );

  useEffect(() => {
    const instance = chatInstanceRef.current;
    if (!instance) return;

    messages.forEach((message) => {
      if (
        message.role === "user" ||
        seenRapidaMessageIds.current.has(message.id)
      ) {
        return;
      }

      seenRapidaMessageIds.current.add(message.id);
      void addMessageToChat({
        id: message.id,
        output: {
          generic: message.messages.map((text) => ({
            response_type: MessageResponseTypes.TEXT,
            text,
          })),
        },
      });
    });
  }, [messages, addMessageToChat, instanceReadyVersion]);

  const customSendMessage = useCallback<
    NonNullable<PublicConfigMessaging["customSendMessage"]>
  >(
    async (request, requestOptions, instance) => {
      chatInstanceRef.current = instance;
      const text = request.input.text?.trim() ?? "";

      if (!text) {
        await addWelcomeMessage(instance, deployment);
        return;
      }

      await voiceAgent.onSendText(text);

      return new Promise<void>((resolve) => {
        if (requestOptions.signal.aborted) {
          resolve();
          return;
        }

        const abortHandler = () => {
          pendingResponses.current = pendingResponses.current.filter(
            (pending) => pending.resolve !== resolve,
          );
          resolve();
        };

        pendingResponses.current.push({
          resolve,
          abortHandler,
          signal: requestOptions.signal,
        });
        requestOptions.signal.addEventListener("abort", abortHandler, {
          once: true,
        });
      });
    },
    [deployment, voiceAgent],
  );

  const onBeforeRender = useCallback(
    async (instance: ChatInstance) => {
      chatInstanceRef.current = instance;
      applyAiChatInputStyle();
      setInstanceReadyVersion((version) => version + 1);
      await aiChatConfig.onBeforeRender?.(instance);
    },
    [aiChatConfig],
  );

  const onViewChange = useCallback(
    (event: BusEventViewChange, instance: ChatInstance) => {
      setCustomElementOpen(Boolean(event.newViewState.mainWindow));
      aiChatConfig.onViewChange?.(event, instance);
    },
    [aiChatConfig],
  );

  const renderWriteableElements = useMemo<RenderWriteableElementResponse>(
    () => ({
      ...aiChatConfig.renderWriteableElements,
      afterInputElement: (
        <>
          {aiChatConfig.renderWriteableElements?.afterInputElement}
          <AudioControls voiceAgent={voiceAgent} voiceEnabled={voiceEnabled} />
        </>
      ),
    }),
    [aiChatConfig.renderWriteableElements, voiceAgent, voiceEnabled],
  );

  const chatProps = useMemo<ChatContainerProps>(() => {
    const defaultProps: ChatContainerProps = {
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
        minimizeButtonIconType:
          dockSide === "left"
            ? MinimizeButtonIconType.SIDE_PANEL_LEFT
            : MinimizeButtonIconType.SIDE_PANEL_RIGHT,
      },
      history: {
        isOn: false,
      },
      launcher: {
        isOn: layout === "floating" ? showLauncher !== false : false,
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
      injectTheme ??
      aiChatConfig.injectCarbonTheme ??
      defaultProps.injectCarbonTheme;

    return {
      ...defaultProps,
      ...aiChatConfig,
      injectCarbonTheme: resolvedInjectTheme,
      header: {
        ...defaultProps.header,
        ...aiChatConfig.header,
      },
      history: {
        ...defaultProps.history,
        ...aiChatConfig.history,
      },
      launcher: {
        ...defaultProps.launcher,
        ...aiChatConfig.launcher,
      },
      layout: {
        ...defaultProps.layout,
        ...aiChatLayout,
        customProperties: {
          ...defaultProps.layout?.customProperties,
          ...aiChatLayout?.customProperties,
        },
      },
      input: {
        ...aiChatConfig.input,
        isDisabled:
          channel === Channel.Audio || aiChatConfig.input?.isDisabled,
      },
      messaging: {
        ...defaultProps.messaging,
        ...aiChatConfig.messaging,
        customSendMessage,
      },
      onBeforeRender,
      onViewChange,
      renderWriteableElements,
    };
  }, [
    aiChatConfig,
    channel,
    customSendMessage,
    displayName,
    dockSide,
    aiChatLayout,
    injectTheme,
    isCustomElement,
    language,
    layout,
    logoUrl,
    onBeforeRender,
    onViewChange,
    position,
    renderWriteableElements,
    showLauncher,
    themeMode,
  ]);

  if (!isCustomElement) {
    return <ChatContainer {...chatProps} />;
  }

  return (
    <div style={getCustomElementShellStyle(layout, dockSide, customElementOpen)}>
      <ChatCustomElement
        {...chatProps}
        className="rapida-theme-chat"
        style={customElementStyle}
      />
    </div>
  );
};

async function addWelcomeMessage(
  instance: ChatInstance,
  deployment: AssistantWebpluginDeployment,
) {
  const generic: MessageResponse["output"]["generic"] = [];
  const greeting = deployment.getGreeting();
  const suggestions = deployment.getSuggestionList();

  if (greeting) {
    generic.push({
      response_type: MessageResponseTypes.TEXT,
      text: greeting,
    });
  }

  if (suggestions.length > 0) {
    generic.push({
      response_type: MessageResponseTypes.OPTION,
      preference: OptionItemPreference.BUTTON,
      options: suggestions.map((label) => ({
        label,
        value: {
          input: {
            text: label,
          },
        },
      })),
    });
  }

  if (generic.length > 0) {
    await instance.messaging.addMessage({
      id: "rapida-welcome",
      output: { generic },
    });
  }
}

function applyAiChatInputStyle() {
  document.querySelectorAll("cds-aichat-react").forEach((element) => {
    const root = element.shadowRoot;
    if (!root || root.getElementById(AI_CHAT_INPUT_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = AI_CHAT_INPUT_STYLE_ID;
    style.textContent = AI_CHAT_INPUT_STYLE;
    root.appendChild(style);
  });
}

function resolveLayoutSettings(
  settings: LayoutSettings,
  legacyPosition?: WidgetPosition,
  legacyShowLauncher?: boolean,
): ResolvedLayoutSettings {
  const position = legacyPosition ?? "bottom-right";

  if (!settings) {
    return {
      mode: "floating",
      position,
      showLauncher: legacyShowLauncher,
    };
  }

  if (typeof settings === "string") {
    return {
      mode: settings,
      position,
      showLauncher: legacyShowLauncher,
    };
  }

  const {
    mode = "floating",
    position: layoutPosition,
    showLauncher,
    ...aiChatLayout
  } = settings;

  return {
    mode,
    position: layoutPosition ?? position,
    showLauncher: showLauncher ?? legacyShowLauncher,
    aiChatLayout,
  };
}

function getThemeLayoutProperties(
  layout: string,
  position: string,
): Partial<Record<LayoutCustomProperties, string>> | undefined {
  if (layout !== "floating") return undefined;

  return {
    [LayoutCustomProperties.width]: FLOATING_PANEL_WIDTH,
    [LayoutCustomProperties.height]: FLOATING_PANEL_HEIGHT,
    [LayoutCustomProperties.max_height]: FLOATING_PANEL_HEIGHT,
    [LayoutCustomProperties.bottom_position]: position.startsWith("bottom")
      ? SHELL_OFFSET
      : "auto",
    [LayoutCustomProperties.top_position]: position.startsWith("top")
      ? SHELL_OFFSET
      : "auto",
    [LayoutCustomProperties.right_position]: position.endsWith("right")
      ? SHELL_OFFSET
      : "auto",
    [LayoutCustomProperties.left_position]: position.endsWith("left")
      ? SHELL_OFFSET
      : "auto",
    [LayoutCustomProperties.launcher_position_bottom]:
      position.startsWith("bottom") ? SHELL_OFFSET : "auto",
    [LayoutCustomProperties.launcher_position_right]: position.endsWith("right")
      ? SHELL_OFFSET
      : "auto",
  };
}

function getCustomElementShellStyle(
  layout: string,
  dockSide: "left" | "right",
  open: boolean,
): CSSProperties {
  if (layout === "inline") {
    return {
      width: "100%",
      height: "100%",
      minHeight: "560px",
    };
  }

  return {
    position: "fixed",
    top: 0,
    bottom: 0,
    [dockSide]: 0,
    width: open ? PANEL_WIDTH : 0,
    height: "100dvh",
    zIndex: SHELL_Z_INDEX,
  } as CSSProperties;
}

const customElementStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
};
