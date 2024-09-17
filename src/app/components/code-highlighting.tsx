import React, { FC, HTMLAttributes, useEffect, useState } from "react";
import hljs from "highlight.js";
import { cn } from "@/styles/media";
import "highlight.js/styles/default.css";
export interface CodeHighlightingProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
}

export const CodeHighlighting: FC<CodeHighlightingProps> = ({
  language,
  code,
  className,
}) => {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    // Highlight the code using highlight.js with auto language detection
    try {
      const result = hljs.highlightAuto(code).value;
      setHighlightedCode(result);
    } catch (error) {
      setHighlightedCode(code);
    }
  }, [code]);

  return (
    <pre className={cn("!pks_overflow-visible !pks_text-base", className)}>
      <div className="pks_bg-white dark:pks_bg-slate-950 pks_rounded-lg pks_border-[0.5px] pks_relative dark:pks_border-slate-700">
        <div className="pks_border-b flex pks_bg-gray-50 dark:pks_bg-slate-800 pks_rounded-t-lg dark:pks_border-slate-700">
          <div className="pks_px-4 pks_py-2 pks_opacity-70">{language}</div>
        </div>

        <div className="pks_overflow-y-auto pks_p-4" dir="ltr">
          <pre
            className={cn(
              "!pks_prose-sm pks_relative",
              "!pks_whitespace-pre",
              className
            )}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </div>
    </pre>
  );
};
