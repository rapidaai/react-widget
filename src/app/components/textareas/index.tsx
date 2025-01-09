import React, { useState } from "react";
import { cn } from "@/styles/media";
import { useEnvironment } from "@/hooks/use-environment";

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
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const { theme } = useEnvironment();
  return (
    <div
      style={{
        borderColor: isFocused ? `${theme.color}` : "defaultColor",
      }}
      className={cn(
        "pks_w-full",
        "dark:pks_placeholder-gray-600 pks_placeholder-gray-400",
        "pks_border-[1px] pks_border-gray-200 dark:pks_border-gray-600/50 pks_rounded-md",
        "dark:pks_text-slate-300 pks_text-slate-600",
        "focus:pks_ring-0 focus:pks_outline-none",
        "pks_bg-gray-50 dark:pks_bg-slate-900",
        "focus-within:pks_bg-white",
        "pks_flex pks_items-center",
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ height: textareaHeight }} // Dynamically set height
        className={cn(
          //   "pks_textarea pks_textarea--size_md pks_textarea--variant_outline pks_min-h_unset pks_overflow_hidden pks_w_100% pks_resize_none pks_border_none! pks_ring_none! pks_shadow_none! pks_bg_transparent pks_px_3 pks_py_2 pks_ml_1 pks_mr_2 pks_max-h_200px pks_overflow-y_auto! light:[&::placeholder]:pks_text_gray.600 dark:[&::placeholder]:pks_text_grayDark.200 pks_ai-chat__message-input",
          "pks_resize-none pks_w-full pks_max-h-80 pks_no-scroll",
          "dark:pks_placeholder-gray-600 pks_placeholder-gray-400",
          "focus:pks_ring-0 focus:pks_outline-none",
          "pks_bg-gray-50 dark:pks_bg-slate-800",
          "focus:pks_bg-white no-scrollbar pks_my-0",
          props.className
        )}
        rows={1}
        placeholder={props.placeholder}
      ></textarea>
      <div className="pks_flex pks_items-end pks_justify-end pks_m-2">
        {props.actions && props.actions}
      </div>
    </div>
  );
});
