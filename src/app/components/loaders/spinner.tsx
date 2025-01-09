import { useEnvironment } from "@/hooks/use-environment";
import { cn } from "@/styles/media";

/**
 *
 * @param param0
 * @returns
 */

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  const { theme } = useEnvironment();
  return (
    // <div role="status" className={className}>
    <div
      className={cn(
        size === "md" && "pks_h-9 pks_w-9 pks_border-[2.5px]",
        size === "lg" && "pks_h-14 pks_w-14 pks_border-[2.5px]",
        size === "sm" && "pks_h-5 pks_w-5 pks_border-[2px]",
        size === "xs" && "pks_h-[13px] pks_w-[13px] pks_border-[2px]",
        "pks_rounded-full pks_animate-spin !pks_border-r-transparent",
        className
      )}
      style={{
        borderColor: theme.color,
        borderTopStyle: "solid",
        borderLeftStyle: "solid",
        borderBottomStyle: "dotted",
      }}
    ></div>
  );
}
