import React, { useState } from "react";
import { cn } from "@/styles/media";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  row?: number;
  wrapperClassName?: string;
}

/**
 *
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props: TextAreaProps, ref) => {
    /**
     * when any request is going disable all the input boxes
     */
    return (
      <textarea
        {...props}
        id={props.name}
        ref={ref}
        required
        name={props.name}
        rows={props.row}
        className={cn(
          "pks_block pks_p-2.5 pks_resize-none pks_w-full",
          "dark:pks_placeholder-gray-600 pks_placeholder-gray-400",
          "pks_border-[1px] pks_border-gray-300 dark:pks_border-gray-600/50 pks_rounded-md",
          "dark:focus:pks_border-blue-600 focus:pks_border-blue-600",
          "dark:pks_text-slate-300 pks_text-slate-600",
          "focus:pks_ring-0 focus:pks_outline-none",
          "pks_bg-gray-50 dark:pks_bg-slate-900",
          props.className
        )}
        placeholder={props.placeholder}
      ></textarea>
    );
  }
);

interface TextAreaWithActionProps extends TextAreaProps {
  actions?: React.ReactElement;
}

export const ScalableTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaWithActionProps
>((props: TextAreaWithActionProps, ref) => {
  /**
   * when any request is going disable all the input boxes
   */
  const [textareaHeight, setTextareaHeight] = useState("auto");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Reset height to auto to allow shrinking
    e.target.style.height = "auto";
    // Set height to scroll height, with a minimum of 32px (adjust as needed)
    e.target.style.height = `${Math.max(e.target.scrollHeight, 32)}px`;

    // Update the state if needed
    if (textareaHeight !== e.target.style.height) {
      setTextareaHeight(e.target.style.height);
    }

    // Propagate onChange event to parent component
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const { wrapperClassName, ...attr } = props;
  return (
    <div
      className={cn(
        "pks_relative",
        "pks_w-full pks_min-h-[3rem]",
        "dark:pks_placeholder-gray-600 pks_placeholder-gray-400",
        "pks_border-[1px] pks_border-gray-300 dark:pks_border-gray-600/50 pks_rounded-md",
        "dark:focus-within:pks_border-blue-600 focus-within:pks_border-blue-600",
        "dark:pks_text-slate-300 pks_text-slate-600",
        "focus:pks_ring-0 focus:pks_outline-none",
        "pks_bg-gray-50 dark:pks_bg-slate-900",
        "focus-within:pks_bg-white",
        wrapperClassName
      )}
    >
      <textarea
        {...attr}
        id={props.name}
        ref={ref}
        required
        name={props.name}
        onChange={handleChange}
        style={{ height: textareaHeight }} // Dynamically set height
        className={cn(
          "pks_p-2 pks_rounded-lg",
          "pks_block pks_resize-none pks_w-full min-h-[3rem] pks_max-h-80",
          "dark:pks_placeholder-gray-600 pks_placeholder-gray-400",
          "focus:pks_ring-0 focus:pks_outline-none",
          "pks_bg-gray-50 dark:bg-slate-900",
          "focus:pks_bg-white",
          props.className
        )}
        rows={props.row}
        placeholder={props.placeholder}
      ></textarea>
      {props.actions && props.actions}
    </div>
  );
});
