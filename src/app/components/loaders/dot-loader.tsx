import React, { HTMLAttributes } from "react";

export function DotLoader(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="pks_flex pks_flex-row pks_gap-0.5 pks_items-center pks_animate-pulse">
      <div className="pks_w-1 pks_h-1 pks_rounded-full pks_bg-blue-500 pks_animate-bounceCustom [pks_animation-delay:-0.3s]"></div>
      <div className="pks_w-1 pks_h-1 pks_rounded-full pks_bg-blue-500 pks_animate-bounceCustom [pks_animation-delay:-0.15s]"></div>
      <div className="pks_w-1 pks_h-1 pks_rounded-full pks_bg-blue-500 pks_animate-bounceCustom"></div>
    </div>
  );
}
