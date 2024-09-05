import React, { FC, HTMLAttributes } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import type { Extension } from "@codemirror/state";
import { cn } from "@/app/styles/media";
import { useDarkMode } from "@/app/contexts/dark-mode-context";

export interface CodeHighlightingProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  lineNumbers?: boolean;
  foldGutter?: boolean;
}

export const CodeHighlighting: FC<
  CodeHighlightingProps & { extensions: Extension[] }
> = React.memo(({ code, foldGutter, lineNumbers, className, extensions }) => {
  //
  const { isDarkMode } = useDarkMode();
  return (
    <pre
      className={cn(
        "!prose-base relative border rounded-md dark:border-gray-800",
        "p-0 m-0",
        className
      )}
    >
      <code>
        <CodeMirror
          value={code}
          editable={false}
          readOnly={true}
          basicSetup={{
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            lineNumbers: lineNumbers,
            foldGutter: foldGutter,
          }}
          theme={isDarkMode ? "dark" : "light"}
          extensions={[...extensions, EditorView.lineWrapping]}
          // [cpp()]}
        />
      </code>
    </pre>
  );
});
