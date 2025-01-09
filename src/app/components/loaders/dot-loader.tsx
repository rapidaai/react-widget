import { useEnvironment } from "@/hooks/use-environment";
import React, { HTMLAttributes } from "react";

export function DotLoader(props: HTMLAttributes<HTMLDivElement>) {
  const { theme } = useEnvironment();
  return (
    <div className="pks_flex pks_flex-row pks_gap-0.5 pks_items-center pks_animate-pulse">
      <div
        style={{
          background: theme.color,
        }}
        className="pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom [animation-delay:-0.3s]"
      ></div>
      <div
        style={{
          background: theme.color,
        }}
        className="pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom [animation-delay:-0.15s]"
      ></div>
      <div
        style={{
          background: theme.color,
        }}
        className="pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom"
      ></div>
    </div>
  );
}
