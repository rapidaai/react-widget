import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx"; // Importing Markdown-to-JSX library
import { cn } from "@/app/styles/media"; // Importing utility function for conditional class names
import { angular } from "@codemirror/lang-angular";
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { less } from "@codemirror/lang-less";
import { liquid } from "@codemirror/lang-liquid";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sass } from "@codemirror/lang-sass";
import { sql } from "@codemirror/lang-sql";
import { vue } from "@codemirror/lang-vue";
import { wast } from "@codemirror/lang-wast";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { Extension } from "@uiw/react-codemirror";
import { CodeHighlighting } from "@/app/app/components/code-highlighting";

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

const CodeBlock = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  const [languageExtension, setLanguageExtension] = useState<Extension[]>([]);

  useEffect(() => {
    let le;
    if (className?.toLowerCase().includes("lang-angular")) {
      le = angular();
    } else if (className?.toLowerCase().includes("lang-cpp")) {
      le = cpp();
    } else if (className?.toLowerCase().includes("lang-css")) {
      le = css();
    } else if (className?.toLowerCase().includes("lang-go")) {
      le = go();
    } else if (className?.toLowerCase().includes("lang-html")) {
      le = html();
    } else if (className?.toLowerCase().includes("lang-java")) {
      le = java();
    } else if (className?.toLowerCase().includes("lang-javascript")) {
      le = javascript();
    } else if (className?.toLowerCase().includes("lang-json")) {
      le = json();
    } else if (className?.toLowerCase().includes("lang-less")) {
      le = less();
    } else if (className?.toLowerCase().includes("lang-liquid")) {
      le = liquid();
    } else if (className?.toLowerCase().includes("lang-markdown")) {
      le = markdown();
    } else if (className?.toLowerCase().includes("lang-php")) {
      le = php();
    } else if (className?.toLowerCase().includes("lang-python")) {
      le = python();
    } else if (className?.toLowerCase().includes("lang-rust")) {
      le = rust();
    } else if (className?.toLowerCase().includes("lang-sass")) {
      le = sass();
    } else if (className?.toLowerCase().includes("lang-sql")) {
      le = sql();
    } else if (className?.toLowerCase().includes("lang-vue")) {
      le = vue();
    } else if (className?.toLowerCase().includes("lang-wast")) {
      le = wast();
    } else if (className?.toLowerCase().includes("lang-xml")) {
      le = xml();
    } else if (className?.toLowerCase().includes("lang-yaml")) {
      le = yaml();
    } else {
      le = undefined;
    }

    if (le) setLanguageExtension([le]);
  }, [children, className]);

  if (languageExtension.length > 0)
    return (
      <CodeHighlighting
        className={cn("my-3", className)}
        code={children}
        lineNumbers={false}
        foldGutter={false}
        extensions={languageExtension}
      />
    );

  return (
    <span
      className={cn(
        className,
        "pks_font-mono pks_text-sm pks_text-red-600 pks_underline"
      )}
    >
      {children}
    </span>
  );
};

export default MarkdownRenderer; // Export the MarkdownRenderer component
