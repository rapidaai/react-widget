import React, { useState } from "react";
import { cn } from "@/app/styles/media";
import { Button } from "@/app/app/components/buttons";
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
          "block p-2.5 resize-none w-full",
          "dark:placeholder-gray-600 placeholder-gray-400",
          "border-[1px] border-gray-300 dark:border-gray-600/50 rounded-md",
          "dark:focus:border-blue-600 focus:border-blue-600",
          "dark:text-slate-300 text-slate-600",
          "focus:ring-0 focus:outline-none",
          "bg-gray-50 dark:bg-slate-900",
          props.className
        )}
        placeholder={props.placeholder}
      ></textarea>
    );
  }
);

interface TextAreaWithActionProps extends TextAreaProps {
  actions?: React.ReactElement[];
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
        "p-1",
        "relative",
        "w-full min-h-[3rem]",
        "dark:placeholder-gray-600 placeholder-gray-400",
        "border-[1px] border-gray-300 dark:border-gray-600/50 rounded-md",
        "dark:focus-within:border-blue-600 focus-within:border-blue-600",
        "dark:text-slate-300 text-slate-600",
        "focus:ring-0 focus:outline-none",
        "bg-gray-50 dark:bg-slate-900",
        "focus-within:bg-white",
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
          "block resize-none w-full min-h-[3rem] max-h-80",
          "dark:placeholder-gray-600 placeholder-gray-400",
          "focus:ring-0 focus:outline-none",
          "bg-gray-50 dark:bg-slate-900",
          "focus:bg-white",
          props.className
        )}
        rows={props.row}
        placeholder={props.placeholder}
      ></textarea>

      {props.actions && (
        <div className="flex absolute space-x-2 justify-end p-1 bottom-0 right-0">
          {props.actions.map((x, idx) => {
            return <div key={idx}>{x}</div>;
          })}
        </div>
      )}
    </div>
  );
});
