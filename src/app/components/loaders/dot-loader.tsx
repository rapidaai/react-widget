import { useEnvironment } from "@/hooks/use-environment";
import { cn } from "@/styles/media";
import React, { HTMLAttributes } from "react";

export function DotLoader(props: HTMLAttributes<HTMLDivElement>) {
  const { theme } = useEnvironment();
  return (
    <div className="pks_flex pks_flex-row pks_gap-0.5 pks_items-center pks_animate-pulse">
      <div
        {...props}
        className={cn(
          "pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom [animation-delay:-0.3s]",
          props.className
        )}
      ></div>
      <div
        {...props}
        className={cn(
          "pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom [animation-delay:-0.15s]",
          props.className
        )}
      ></div>
      <div
        {...props}
        className={cn(
          "pks_w-1 pks_h-1 pks_rounded-full pks_animate-bounceCustom",
          props.className
        )}
      ></div>
    </div>
  );
}
