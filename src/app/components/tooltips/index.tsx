import type { FC, HTMLAttributes } from "react";
import React, { useState } from "react";
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from "@/app/components/portal-to-follow-elem";
import { cn } from "@/styles/media";
interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  position?: "top" | "right" | "bottom" | "left";
  triggerMethod?: "hover" | "click";
  popupContent: React.ReactNode;
  children: React.ReactNode;
  hideArrow?: boolean;
}

const arrow = (
  <svg
    className="pks_absolute pks_text-white dark:pks_text-gray-600 pks_h-2 pks_w-full pks_left-0 pks_top-full"
    x="0px"
    y="0px"
    viewBox="0 0 255 255"
  >
    <polygon
      className="pks_fill-current"
      points="0,0 127.5,127.5 255,0"
    ></polygon>
  </svg>
);

export const Tooltip: FC<TooltipProps> = ({
  position = "top",
  triggerMethod = "hover",
  popupContent,
  children,
  hideArrow,
  className,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement={position}
      offset={10}
    >
      <PortalToFollowElemTrigger
        onClick={() => triggerMethod === "click" && setOpen((v) => !v)}
        onMouseEnter={() => triggerMethod === "hover" && setOpen(true)}
        onMouseLeave={() => triggerMethod === "hover" && setOpen(false)}
      >
        {children}
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-[9999]">
        <div
          className={cn(
            "pks_relative pks_px-3 pks_py-2 pks_text-xs pks_font-normal pks_rounded-md pks_shadow-lg pks_border-[0.5px] pks_border-gray-300 dark:pks_border-gray-800",
            "pks_bg-white dark:pks_bg-gray-700",
            "dark:pks_bg-gray-900/90 dark:pks_text-gray-300",
            className
          )}
        >
          {popupContent}
          {!hideArrow && arrow}
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};
