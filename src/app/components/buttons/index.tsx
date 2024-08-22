import { Spinner } from "@/app/app/components/loaders/spinner";
import React, { FC } from "react";
import { cn } from "@/app/styles/media";

/**
 *
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   *
   */
  children?: any;

  /**
   * if loading represent
   */
  isLoading?: boolean;

  size?: "sm" | "md" | "lg";
}

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   *
   */
  children?: any;

  /**
   * if loading represent
   */
  isLoading?: boolean;
}

export function Button(props: ButtonProps) {
  const { isLoading, ...btnProps } = props;
  return (
    <button
      {...btnProps}
      className={cn(
        "pks_flex pks_h-9 pks_leading-7 pks_truncate pks_w-fit pks_justify-center pks_items-center pks_relative",
        "pks_bg-blue-600 pks_font-medium pks_text-white pks_hover:bg-blue-500 pks_py-1.5 pks_px-3 pks_rounded-full",
        "button",
        props.disabled && "!pks_opacity-80 !pks_cursor-not-allowed",
        props.className
      )}
    >
      {isLoading ? (
        <span className="pks_inline-block pks_absolute">
          <Spinner />
        </span>
      ) : (
        props.children
      )}
    </button>
  );
}

export function BlueBorderButton(props: ButtonProps) {
  const { isLoading, ...btnProps } = props;

  return (
    <button
      {...btnProps}
      className={cn(
        "pks_flex pks_h-9 pks_truncate pks_w-fit pks_justify-center pks_items-center",
        "pks_py-1.5 pks_px-3 pks_rounded-full",
        "pks_font-medium",
        "pks_text-blue-600 dark:pks_text-blue-400",
        "pks_border-[1.5px] pks_border-blue-600 dark:pks_border-blue-600 pks_hover:border-blue-400 dark:pks_hover:border-blue-700",
        "pks_bg-gray-50 dark:pks_bg-gray-900/50 dark:pks_hover:bg-blue-700/20 pks_hover:bg-blue-200/20",
        "button",
        props.disabled && "pks_cursor-not-allowed pks_opacity-70",
        props.className
      )}
    >
      {isLoading ? (
        <span className="pks_inline-block pks_absolute">
          <Spinner />
        </span>
      ) : (
        props.children
      )}
    </button>
  );
}

export function BorderButton(props: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "pks_flex pks_h-9 pks_truncate pks_w-fit pks_justify-center pks_items-center",
        "pks_text-gray-500 dark:pks_text-gray-400 pks_font-medium",
        "pks_py-2 pks_px-2.5 pks_rounded-full",
        "pks_border-[1.5px] pks_border-gray-300/50 dark:pks_border-gray-600/50",
        "pks_bg-gray-50 dark:pks_bg-gray-900/50 dark:pks_hover:bg-gray-700/50 pks_hover:bg-gray-200",
        "button",
        "pks_focus:outline-none pks_focus:outline-2 pks_focus:outline pks_focus:outline-offset-1 pks_outline-gray-100/10",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export const LinkBorderButton: FC<LinkProps> = (props) => {
  const { isLoading, ...btnProps } = props;
  return (
    <a
      {...btnProps}
      className={cn(
        "pks_flex pks_h-9 pks_truncate pks_w-fit pks_justify-center pks_items-center",
        "pks_py-1.5 pks_px-3 pks_rounded-full",
        "pks_font-medium",
        "pks_cursor-pointer",
        "pks_text-blue-600 dark:pks_text-blue-400",
        "pks_border-[1.5px]  pks_border-blue-600 dark:pks_border-blue-600 pks_hover:border-blue-400 dark:pks_hover:border-blue-700",
        "pks_bg-gray-50 dark:pks_bg-gray-900/50 dark:pks_hover:bg-blue-700/20 pks_hover:bg-blue-200/20",
        "button",
        props.className
      )}
    >
      {isLoading ? (
        <span className="pks_inline-block pks_absolute">
          <Spinner />
        </span>
      ) : (
        props.children
      )}
    </a>
  );
};

export function SimpleButton(props: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "pks_flex pks_h-9 pks_truncate pks_w-fit pks_justify-center pks_items-center pks_font-medium",
        "pks_text-gray-500 dark:pks_hover:text-gray-300 pks_hover:text-gray-900",
        "pks_py-1.5 pks_px-3 pks_rounded-md",
        "pks_hover:bg-gray-100 dark:pks_hover:bg-gray-900",
        "button",
        "pks_focus:outline-none",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export function IconButton(props: ButtonProps) {
  return (
    <SimpleButton
      className={cn("!pks_h-6 !pks_w-6 !pks_p-[4px]", props.className)}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </SimpleButton>
  );
}

export function LinkButton(props: LinkProps) {
  return (
    <a
      {...props}
      className={cn(
        "pks_flex pks_h-9 pks_truncate pks_w-fit pks_justify-center pks_items-center pks_font-medium",
        "pks_text-gray-500 dark:pks_hover:text-gray-300 pks_hover:text-gray-900",
        "button",
        "pks_py-1.5 pks_px-2",
        "pks_underline",
        props.className
      )}
    >
      {props.children}
    </a>
  );
}

export function HoverButton(props: ButtonProps) {
  const { isLoading, ...btnProps } = props;
  return (
    <button
      {...btnProps}
      className={cn(
        "pks_flex pks_h-9 pks_leading-7 pks_truncate pks_w-fit pks_justify-center pks_items-center pks_relative pks_border-none",
        "pks_font-medium pks_py-1.5 pks_px-3 pks_rounded-full dark:pks_hover:bg-gray-900 pks_hover:bg-gray-100",
        "button",
        "pks_hover:shadow",
        "pks_focus:outline pks_focus:outline-offset-1 pks_focus:outline-gray-300 dark:pks_focus:outline-gray-700",
        props.className
      )}
    >
      {isLoading ? (
        <span className="pks_inline-block pks_absolute">
          <Spinner />
        </span>
      ) : (
        props.children
      )}
    </button>
  );
}

export const OutlineButton = (props: ButtonProps) => {
  const { isLoading, className, ...btnProps } = props;
  return (
    <Button
      className={cn(
        "pks_rounded-full pks_h-[2.1rem] pks_outline pks_outline-blue-600/50 pks_hover:outline-blue-600 pks_outline-[1.5px] pks_outline-offset-[2px] pks_px-4",
        className,
        props.disabled && "pks_opacity-60"
      )}
      type="submit"
      {...btnProps}
    >
      {props.children}
      {props.isLoading && <Spinner className="pks_h-4 pks_w-4 pks_ml-2" />}
    </Button>
  );
};
