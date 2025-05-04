import { useEnvironment } from "@/hooks/use-environment";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export const HelpArticlePage = () => {
  const { theme } = useEnvironment();
  const location = useLocation();
  //the data here will be an object since an object was

  return (
    <div className="pks_flex pks_flex-col">
      <div className="pks_flex pks_items-center pks_justify-between pks_p-4 pks_border-b pks_border-gray-200">
        <Link
          to="/help"
          style={{
            background: theme.color,
          }}
          className="pks_text-white pks_p-1.5 pks_rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pks_h-5 pks_w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <div className="pks_flex-1 pks_ml-3">
          <div className="pks_flex pks_items-center pks_text-[14px]">
            <span>Help</span>
            <span className="pks_mx-2">/</span>
            <span className="pks_font-medium">{location.state.title}</span>
          </div>
        </div>
      </div>
      <div className="pks_p-4 pks_text-[13px]">
        <ReactMarkdown>{location.state.excerpt}</ReactMarkdown>
      </div>
    </div>
  );
};
