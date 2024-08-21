import React from "react";
import Markdown from "markdown-to-jsx"; // Or any other Markdown library
import { cn } from "@/app/styles/media";

interface MarkdownRendererProps {
  children?: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  return (
    <div className="markdown-content">
      <Markdown
        options={{
          overrides: {
            p: {
              component: ({ children }: { children: React.ReactNode }) => (
                <p
                  className={cn(
                    "prose prose-gray prose-sm dark:prose-invert break-words !max-w-none prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600",
                    "dark:prose-code:!bg-slate-900 dark:prose-pre:!bg-slate-900",
                    "prose-code:!bg-slate-100 prose-pre:!bg-slate-100 leading-normal"
                  )}
                >
                  {children}
                </p>
              ),
            },
            span: {
              component: ({ children }: { children: React.ReactNode }) => (
                <p
                  className={cn(
                    "prose prose-gray prose-sm dark:prose-invert break-words !max-w-none prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600",
                    "dark:prose-code:!bg-slate-900 dark:prose-pre:!bg-slate-900",
                    "prose-code:!bg-slate-100 prose-pre:!bg-slate-100 leading-normal"
                  )}
                >
                  {children}
                </p>
              ),
            },

            ul: {
              component: ({ children }: { children: React.ReactNode }) => (
                <ul className="list-disc pl-5 space-y-2 prose prose-gray prose-sm dark:prose-invert break-words !max-w-none prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600 dark:prose-code:!bg-slate-900 dark:prose-pre:!bg-slate-900 prose-code:!bg-slate-100 prose-pre:!bg-slate-100 leading-normal">
                  {children}
                </ul>
              ),
            },

            ol: {
              component: ({ children }: { children: React.ReactNode }) => (
                <ol className="list-item pl-5 space-y-2 prose prose-gray prose-sm dark:prose-invert break-words !max-w-none prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600 dark:prose-code:!bg-slate-900 dark:prose-pre:!bg-slate-900 prose-code:!bg-slate-100 prose-pre:!bg-slate-100 leading-normal">
                  {children}
                </ol>
              ),
            },
            li: {
              component: ({ children }: { children: React.ReactNode }) => (
                <li className="pl-2">{children}</li>
              ),
            },
            table: {
              component: ({ children }: { children: React.ReactNode }) => (
                <div className="overflow-x-auto my-1">
                  <table className="min-w-fit border-t border-b dark:border-gray-700">
                    {children}
                  </table>
                </div>
              ),
            },
            thead: {
              component: ({ children }: { children: React.ReactNode }) => (
                <thead className="bg-white dark:bg-gray-950 border-b dark:border-gray-700">
                  {children}
                </thead>
              ),
            },
            tr: {
              component: ({ children }: { children: React.ReactNode }) => (
                <tr className="even:bg-gray-200 odd:bg-white dark:even:bg-gray-700 dark:odd:bg-gray-800">
                  {children}
                </tr>
              ),
            },

            th: {
              component: ({ children }: { children: React.ReactNode }) => (
                <th className="px-2 py-2 text-left text-xs font-medium  uppercase tracking-wider">
                  {children}
                </th>
              ),
            },
            td: {
              component: ({ children }: { children: React.ReactNode }) => (
                <td className="px-2 py-2 text-left text-xs font-medium tracking-wider">
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
};
export default MarkdownRenderer;
