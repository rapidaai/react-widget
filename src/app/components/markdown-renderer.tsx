import React, { FC, memo, useEffect, useMemo, useState } from "react";
import Markdown from "markdown-to-jsx";
import { cn } from "@/styles/media";
import { CodeHighlighting } from "@/app/components/code-highlighting";

// Define the props interface for the MarkdownRenderer component
interface MarkdownRendererProps {
  children?: any; // Accepts children of any type
}

// Define the MarkdownRenderer functional component
const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(
  ({ children }) => {
    return (
      <div className="markdown-content">
        <Markdown
          options={{
            overrides: {
              // Custom rendering for <p> elements
              p: ParagraphBlock,
              // Custom rendering for <span> elements
              h1: {
                component: ({
                  className,
                  children,
                }: {
                  className?: string;
                  children: React.ReactNode;
                }) => (
                  <h1
                    className={cn(
                      className,
                      "pks_pt-2.5 pks_pb-1",
                      "pks_prose prose-gray pks_prose-lg dark:pks_prose-invert pks_break-words !pks_max-w-none prose-img:pks_rounded-xl prose-headings:pks_underline prose-a:pks_text-blue-600",
                      "dark:prose-code:!pks_bg-slate-900 dark:prose-pre:!pks_bg-slate-900",
                      "prose-code:!pks_bg-slate-100 prose-pre:!pks_bg-slate-100 pks_leading-normal pks_font-bold"
                    )}
                  >
                    {children}
                  </h1>
                ),
              },
              h2: {
                component: ({
                  className,
                  children,
                }: {
                  className?: string;
                  children: React.ReactNode;
                }) => (
                  <h2
                    className={cn(
                      className,
                      "pks_pt-2.5 pks_pb-1",
                      "pks_prose prose-gray pks_prose-lg dark:pks_prose-invert pks_break-words !pks_max-w-none prose-img:pks_rounded-xl prose-headings:pks_underline prose-a:pks_text-blue-600",
                      "dark:prose-code:!pks_bg-slate-900 dark:prose-pre:!pks_bg-slate-900",
                      "prose-code:!pks_bg-slate-100 prose-pre:!pks_bg-slate-100 pks_leading-normal pks_font-semibold"
                    )}
                  >
                    {children}
                  </h2>
                ),
              },
              h3: {
                component: ({
                  className,
                  children,
                }: {
                  className?: string;
                  children: React.ReactNode;
                }) => (
                  <h3
                    className={cn(
                      className,
                      "pks_pt-2.5 pks_pb-1",
                      "pks_prose prose-gray pks_prose-lg dark:pks_prose-invert pks_break-words !pks_max-w-none prose-img:pks_rounded-xl prose-headings:pks_underline prose-a:pks_text-blue-600",
                      "dark:prose-code:!pks_bg-slate-900 dark:prose-pre:!pks_bg-slate-900",
                      "prose-code:!pks_bg-slate-100 prose-pre:!pks_bg-slate-100 pks_leading-normal pks_font-semibold"
                    )}
                  >
                    {children}
                  </h3>
                ),
              },
              h4: {
                component: ({
                  className,
                  children,
                }: {
                  className?: string;
                  children: React.ReactNode;
                }) => (
                  <h4
                    className={cn(
                      className,
                      "pks_pt-2.5 pks_pb-1",
                      "pks_prose prose-gray pks_prose-lg dark:pks_prose-invert pks_break-words !pks_max-w-none prose-img:pks_rounded-xl prose-headings:pks_underline prose-a:pks_text-blue-600",
                      "dark:prose-code:!pks_bg-slate-900 dark:prose-pre:!pks_bg-slate-900",
                      "prose-code:!pks_bg-slate-100 prose-pre:!pks_bg-slate-100 pks_leading-normal pks_font-semibold"
                    )}
                  >
                    {children}
                  </h4>
                ),
              },
              span: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <p
                    className={cn(
                      "pks_prose pks_prose-gray pks_prose-base dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600",
                      "dark:prose-code:!pks_bg-slate-900 dark:pks_prose-pre:!bg-slate-900",
                      "pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal"
                    )}
                  >
                    {children}
                  </p>
                ),
              },
              // Custom rendering for <ul> (unordered list) elements
              ul: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <ul className="pks_list-disc pks_pl-5 pks_space-y-2 pks_prose pks_prose-gray pks_prose-base dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600 dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900 pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal">
                    {children}
                  </ul>
                ),
              },
              // Custom rendering for <ol> (ordered list) elements
              ol: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <ol className="pks_list-item pks_pl-5 pks_space-y-2 pks_prose pks_prose-gray pks_prose-base dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600 dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900 pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal">
                    {children}
                  </ol>
                ),
              },
              // Custom rendering for <li> (list item) elements
              li: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <li className="pks_pl-2">{children}</li>
                ),
              },
              // Custom rendering for <table> elements
              table: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <div className="pks_overflow-x-auto pks_my-1">
                    <table className="pks_min-w-max pks_border dark:pks_border-gray-700 pks_rounded-xl">
                      {children}
                    </table>
                  </div>
                ),
              },
              // Custom rendering for <thead> elements
              thead: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <thead className="pks_bg-white dark:pks_bg-gray-950 pks_border-b dark:pks_border-gray-700  pks_rounded-t-xl">
                    {children}
                  </thead>
                ),
              },
              // Custom rendering for <tr> (table row) elements
              tr: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <tr className="even:pks_bg-gray-200 odd:pks_bg-white dark:even:pks_bg-gray-700 dark:pks_odd:bg-gray-800">
                    {children}
                  </tr>
                ),
              },
              // Custom rendering for <th> (table header) elements
              th: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <th className="pks_px-2 pks_py-2 pks_text-left pks_text-base pks_font-medium pks_uppercase pks_tracking-wider">
                    {children}
                  </th>
                ),
              },
              code: CodeBlock,

              // Custom rendering for <td> (table data) elements
              td: {
                component: ({ children }: { children: React.ReactNode }) => (
                  <td className="pks_px-2 pks_py-2 pks_text-left pks_text-base pks_font-medium pks_tracking-wider">
                    {children}
                  </td>
                ),
              },
              // Add more custom elements as needed
            },
          }}
        >
          {children}
        </Markdown>
      </div>
    );
  }
);

const ParagraphBlock: FC<{ className: string; children: any }> = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  const codeBlockRegex = /```(\w+)\s*([\s\S]*?)```/g;

  return (
    <div
      className={cn(
        className,
        "pks_prose pks_prose-gray pks_prose-base dark:pks_prose-invert pks_break-words !max-w-none prose-img:pks_rounded-xl prose-headings:pks_underline prose-a:pks_text-blue-600",
        "dark:pks_prose-code:!pks_bg-slate-900 dark:prose-pre:!pks_bg-slate-900",
        "pks_prose-code:!bg-slate-100 prose-pre:!bg-slate-100 pks_leading-normal"
      )}
    >
      {children}
    </div>
  );
};

const CodeBlock = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  if (className?.includes("lang")) {
    return (
      <div className="pks_my-3">
        <CodeHighlighting
          className={cn(className)}
          code={children}
          language={className?.toLowerCase()}
        />
      </div>
    );
  }
  return (
    <span
      className={cn(
        className,
        "pks_font-mono pks_bg-gray-200 pks_rounded-lg pks_px-2 pks_py-0.5"
      )}
    >
      {children}
    </span>
  );
};

export default MarkdownRenderer; // Export the MarkdownRenderer component
