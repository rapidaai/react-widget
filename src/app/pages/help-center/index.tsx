import { useEnvironment } from "@/hooks/use-environment";
import { cn } from "@/styles/media";
import { NavLink } from "react-router-dom";

export const HelpCenterPage = () => {
  const { theme } = useEnvironment();
  const articles = [
    {
      id: 1,
      title: "How do I add a live chat to my website?",
      excerpt:
        "So, you just signed up to Crisp and are ready to add the chatbox widget to your website. Great! This page will help...",
    },
    {
      id: 2,
      title: "How to use Triggers?",
      excerpt:
        "Triggers can be used to send automated events to the chatbox of your visitors & users. Triggers are activated upon...",
    },
    {
      id: 3,
      title: "How can I open the chatbox on click on a custom button?",
      excerpt:
        'The Crisp chatbox can be opened and closed via your website JavaScript code. This allows you to create custom "Cha...',
    },
    {
      id: 4,
      title: "How do I add a Chatbot to my website?",
      excerpt:
        "The chatbot plugin helps you to create your own chatbot. Draw complex response flows, with events (eg. user sent...",
    },
    {
      id: 5,
      title: "How do I install Crisp Live chat on WordPress?",
      excerpt: "Installing Crisp Live chat widget on WordPress is really easy!",
    },
    {
      id: 6,
      title: "What's Crisp EU GDPR compliance status?",
      excerpt:
        "The European Union General Data Protection Regulation (GDPR) is a regulation that aims at unifying EU member...",
    },
    {
      id: 7,
      title: "Connect WhatsApp Business Platform with Crisp",
      excerpt: "",
    },
  ];

  return (
    <div className="pks_flex pks_flex-col pks_w-full pks_overflow-auto no-scrollbar pks_h-full">
      <div
        style={{
          background: theme.color,
        }}
        className="pks_text-white pks_py-3 pks_text-center pks_w-full pks_sticky pks_top-0"
      >
        <h1 className="pks_text-[14px] pks_font-semibold">
          Most Frequently Asked Question
        </h1>
      </div>
      <div className="pks_flex-1">
        {articles.map((article, index) => (
          <NavLink
            to={`/help/${article.id}`}
            state={{
              title: article.title,
              excerpt: article.excerpt,
            }}
            key={article.id}
            className={cn(
              "pks_flex pks_items-start pks_p-4 pks_border-b pks_border-gray-200 pks_justify-between"
            )}
          >
            {/* Book Icon */}
            <div className="pks_flex pks_flex-col">
              <div className="pks_flex pks_space-x-1 pks_items-start">
                <div
                  style={{
                    color: theme.color,
                  }}
                  className="pks_mt-[0.2rem]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="pks_h-[19px] pks_w-[19px]"
                  >
                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                  </svg>
                </div>
                <h2 className="pks_text-[14px] pks_font-medium pks_text-gray-800 pks_mb-1">
                  {article.title}
                </h2>
              </div>

              <div className="">
                {article.excerpt && (
                  <p className="pks_text-gray-600 pks_text-sm">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </div>
            <div className="pks_text-gray-400 pks_ml-2 pks_self-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="pks_h-5 pks_w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="pks_p-4 pks_flex pks_items-center pks_border-t pks_border-gray-200 pks_sticky pks_bottom-0 pks_bg-white md:pks_rounded-b-xl">
        <div className="pks_text-gray-400 pks_mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pks_h-5 pks_w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Find help articles..."
          className="pks_flex-1 pks_bg-transparent pks_border-none pks_text-gray-500 focus:pks_outline-none pks_text-sm focus:pks_border-none"
        />
      </div>
    </div>
  );
};
