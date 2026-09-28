import type { CSSProperties } from "react";
import {
  ChatContainerProps,
  LayoutCustomProperties,
} from "@carbon/ai-chat";

const PANEL_WIDTH = "min(100vw, 450px)";
const FLOATING_PANEL_WIDTH = "min(calc(100vw - 32px), 450px)";
const FLOATING_PANEL_HEIGHT = "min(85dvh, calc(100dvh - 96px))";
const SHELL_OFFSET = "1rem";
const SHELL_Z_INDEX = 9999;

export type WidgetLayoutMode =
  | "floating"
  | "docked-right"
  | "docked-left"
  | "inline";
export type WidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left";

export type LayoutSettings = NonNullable<ChatContainerProps["layout"]> & {
  mode?: WidgetLayoutMode;
  position?: WidgetPosition;
};

export interface ResolvedLayoutSettings {
  mode: WidgetLayoutMode;
  position: WidgetPosition;
  aiChatLayout?: ChatContainerProps["layout"];
}

export function resolveLayoutSettings(settings?: LayoutSettings): ResolvedLayoutSettings {
  if (!settings) {
    return {
      mode: "floating",
      position: "bottom-right",
    };
  }

  const {
    mode = "floating",
    position = "bottom-right",
    ...aiChatLayout
  } = settings;

  return {
    mode,
    position,
    aiChatLayout,
  };
}

export function getThemeLayoutProperties(
  layout: WidgetLayoutMode,
  position: WidgetPosition,
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

export function getCustomElementShellStyle(
  layout: WidgetLayoutMode,
  dockSide: "left" | "right",
  open: boolean,
): CSSProperties {
  if (layout === "inline") {
    return { width: "100%", height: "100%", minHeight: "560px" };
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
