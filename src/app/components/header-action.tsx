import { FC, useState } from "react";
import { motion } from "framer-motion";
import { CloseIcon } from "@/icons/close";
import { ChevronsRightLeftIcon } from "@/icons/chevrons-right-left";
import { ChevronsLeftRightIcon } from "@/icons/chevrons-left-right";
import { ChevronDownIcon } from "@/icons/chevron-down";
import { useLocation } from "react-router-dom";
import { ChatIcon } from "@/icons/chat";
import { HelpIcon } from "@/icons/help";
import { cn } from "@/styles/media";
import { AnimatedTabs } from "@/app/components/animated-tabs";
import { useChatNavigation } from "../pages/web-plugin-chat/hooks/use-navigate";

export const Header: FC<{
  isMaximize: boolean;
  toggleOpen: () => void;
  toggelScreen: () => void;
}> = ({ toggleOpen, toggelScreen, isMaximize }) => {
  const { goToMessages } = useChatNavigation();
  const location = useLocation();
  const { pathname } = location;
  const currentPath = "/message/";

  const options = [
    {
      name: "messages",
      icon: <ChatIcon strokeWidth={2} />,
    },
    {
      name: "help",
      icon: <HelpIcon strokeWidth={2} />,
    },
  ];

  const [activeOpt, setActiveOpt] = useState("messages");

  return (
    <div
      className={cn(
        //   "pks_bg-[linear-gradient(103deg,_var(--tw-gradient-stops))] pks_from-custom-gray pks_via-custom-pink pks_to-custom-blue",
        "pks_flex pks_justify-between pks_space-x-1.5 pks_sticky pks_top-0 pks_z-20 pks_rounded-t-xl pks_border-b pks_border-gray-300 pks_ease-in-out"
      )}
    >
      {/* {!pathname.includes(currentPath) && (
        <AnimatedTabs
          tabs={options}
          setActiveTab={setActiveOpt}
          activeTab={activeOpt}
        />
      )} */}

      <div
        className={cn(
          "pks_flex pks_items-center pks_space-x-2 pks_px-4 pks_py-4 pks_w-full"
        )}
      >
        {pathname.includes(currentPath) && (
          <motion.button
            onClick={goToMessages}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-300/40 hover:pks_bg-gray-400/30  pks_p-1 pks_group"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDownIcon
              className="pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-gray-400 group-hover:pks_text-gray-600 pks_rotate-90"
              strokeWidth={3}
            />
          </motion.button>
        )}
        <div className="pks_flex pks_space-x-2 pks_justify-end pks_w-full">
          <motion.button
            onClick={toggleOpen}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-300/40 hover:pks_bg-red-400/30  pks_p-1 pks_group"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloseIcon
              className="pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-gray-400 group-hover:pks_text-red-600 "
              strokeWidth={2.8}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toggelScreen();
            }}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-300/40 hover:pks_bg-blue-400/30  pks_p-1 pks_group"
            aria-label="Maximize"
          >
            {isMaximize ? (
              <ChevronsRightLeftIcon
                className="pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-gray-400 group-hover:pks_text-blue-600  pks_-rotate-45"
                strokeWidth={2.5}
              />
            ) : (
              <ChevronsLeftRightIcon
                className="pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-gray-400 group-hover:pks_text-blue-600  pks_-rotate-45"
                strokeWidth={2.5}
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// export const HeaderAction: FC<{
//   isMaximize: boolean;
//   toggleOpen(): () => void;
//   onToggelScreen: () => void;
// }> = ({ isMaximize, toggleOpen(), onToggelScreen }) => {
//   //   console.dir(pathname);
// };
