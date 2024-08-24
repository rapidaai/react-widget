import React from "react";
import Markdown from "markdown-to-jsx"; // Importing Markdown-to-JSX library
import { cn } from "@/app/styles/media"; // Importing utility function for conditional class names

// Define the props interface for the MarkdownRenderer component
interface MarkdownRendererProps {
  children?: any; // Accepts children of any type
}

// Define the MarkdownRenderer functional component
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
  return (
    <div className="pks_markdown-content">
      <Markdown
        options={{
          overrides: {
            // Custom rendering for <p> elements
            p: {
              component: ({ children }: { children: React.ReactNode }) => (
                <p
                  className={cn(
                    "pks_prose pks_prose-gray pks_prose-sm dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600",
                    "dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900",
                    "pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal"
                  )}
                >
                  {children}
                </p>
              ),
            },
            // Custom rendering for <span> elements
            span: {
              component: ({ children }: { children: React.ReactNode }) => (
                <p
                  className={cn(
                    "pks_prose pks_prose-gray pks_prose-sm dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600",
                    "dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900",
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
                <ul className="pks_list-disc pks_pl-5 pks_space-y-2 pks_prose pks_prose-gray pks_prose-sm dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600 dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900 pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal">
                  {children}
                </ul>
              ),
            },
            // Custom rendering for <ol> (ordered list) elements
            ol: {
              component: ({ children }: { children: React.ReactNode }) => (
                <ol className="pks_list-item pks_pl-5 pks_space-y-2 pks_prose pks_prose-gray pks_prose-sm dark:pks_prose-invert break-words !max-w-none pks_prose-img:rounded-xl pks_prose-headings:underline pks_prose-a:text-blue-600 dark:pks_prose-code:!bg-slate-900 dark:pks_prose-pre:!bg-slate-900 pks_prose-code:!bg-slate-100 pks_prose-pre:!bg-slate-100 leading-normal">
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
                  <table className="pks_min-w-max pks_border-t pks_border-b dark:pks_border-gray-700">
                    {children}
                  </table>
                </div>
              ),
            },
            // Custom rendering for <thead> elements
            thead: {
              component: ({ children }: { children: React.ReactNode }) => (
                <thead className="pks_bg-white dark:pks_bg-gray-950 pks_border-b dark:pks_border-gray-700">
                  {children}
                </thead>
              ),
            },
            // Custom rendering for <tr> (table row) elements
            tr: {
              component: ({ children }: { children: React.ReactNode }) => (
                <tr className="pks_even:bg-gray-200 pks_odd:bg-white dark:pks_even:bg-gray-700 dark:pks_odd:bg-gray-800">
                  {children}
                </tr>
              ),
            },
            // Custom rendering for <th> (table header) elements
            th: {
              component: ({ children }: { children: React.ReactNode }) => (
                <th className="pks_px-2 pks_py-2 pks_text-left pks_text-xs pks_font-medium pks_uppercase pks_tracking-wider">
                  {children}
                </th>
              ),
            },
            // Custom rendering for <td> (table data) elements
            td: {
              component: ({ children }: { children: React.ReactNode }) => (
                <td className="pks_px-2 pks_py-2 pks_text-left pks_text-xs pks_font-medium pks_tracking-wider">
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

export default MarkdownRenderer; // Export the MarkdownRenderer component
