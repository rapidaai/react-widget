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
        "flex h-9 leading-7 truncate w-fit justify-center items-center relative",
        "bg-blue-600 font-medium text-white hover:bg-blue-500 py-1.5 px-3 rounded-full",
        "button",
        props.disabled && "!opacity-80 !cursor-not-allowed",
        props.className
      )}
    >
      {isLoading ? (
        <span className="inline-block absolute">
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
        "flex h-9 truncate w-fit justify-center items-center",
        "py-1.5 px-3 rounded-full",
        "font-medium",
        "text-blue-600 dark:text-blue-400",
        "border-[1.5px] border-blue-600 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-700",
        "bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-blue-700/20 hover:bg-blue-200/20",
        "button",
        props.disabled && "cursor-not-allowed opacity-70",
        props.className
      )}
    >
      {isLoading ? (
        <span className="inline-block absolute">
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
        "flex h-9 truncate w-fit justify-center items-center",
        "text-gray-500 dark:text-gray-400 font-medium",
        "py-2 px-2.5 rounded-full",
        "border-[1.5px] border-gray-300/50 dark:border-gray-600/50",
        "bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-gray-700/50 hover:bg-gray-200",
        "button",
        "focus:outline-none focus:outline-2 focus:outline focus:outline-offset-1 outline-gray-100/10",
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
        "flex h-9 truncate w-fit justify-center items-center",
        "py-1.5 px-3 rounded-full",
        "font-medium",
        "cursor-pointer",
        "text-blue-600 dark:text-blue-400",
        "border-[1.5px]  border-blue-600 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-700",
        "bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-blue-700/20 hover:bg-blue-200/20",
        "button",
        props.className
      )}
    >
      {isLoading ? (
        <span className="inline-block absolute">
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
        "flex h-9 truncate w-fit justify-center items-center font-medium",
        "text-gray-500 dark:hover:text-gray-300 hover:text-gray-900",
        "py-1.5 px-3 rounded-md",
        "hover:bg-gray-100 dark:hover:bg-gray-900",
        "button",
        "focus:outline-none",
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
      className={cn("!h-6 !w-6 !p-[4px]", props.className)}
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
        "flex h-9 truncate w-fit justify-center items-center font-medium",
        "text-gray-500 dark:hover:text-gray-300 hover:text-gray-900",
        "button",
        "py-1.5 px-2",
        "underline",
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
        "flex h-9 leading-7 truncate w-fit justify-center items-center relative border-none",
        "font-medium py-1.5 px-3 rounded-full dark:hover:bg-gray-900 hover:bg-gray-100",
        "button",
        "hover:shadow",
        "focus:outline focus:outline-offset-1 focus:outline-gray-300 dark:focus:outline-gray-700",
        props.className
      )}
    >
      {isLoading ? (
        <span className="inline-block absolute">
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
        "rounded-full h-[2.1rem] outline outline-blue-600/50 hover:outline-blue-600 outline-[1.5px] outline-offset-[2px] px-4",
        className,
        props.disabled && "opacity-60"
      )}
      type="submit"
      {...btnProps}
    >
      {props.children}
      {props.isLoading && <Spinner className="h-4 w-4 ml-2" />}
    </Button>
  );
};
