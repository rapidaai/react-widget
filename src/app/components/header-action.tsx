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
        "pks_flex pks_justify-between pks_space-x-1.5 pks_sticky pks_top-0 pks_z-20 pks_rounded-t-xl"
        // pks_border-b pks_border-gray-300/50 pks_ease-in-out dark:pks_border-gray-800 pks_bg-gray-50
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
          "pks_flex pks_items-center pks_space-x-2 pks_px-4 pks_py-5 pks_w-full"
        )}
      >
        {pathname.includes(currentPath) && (
          <motion.button
            onClick={goToMessages}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-50/10 hover:pks_bg-white/80  pks_p-1 pks_group"
            aria-label="Close"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDownIcon
              className="pks_opacity-75 pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-white dark:pks_text-gray-300 group-hover:pks_text-gray-600 pks_rotate-90"
              strokeWidth={2}
            />
          </motion.button>
        )}
        <div className="pks_flex pks_space-x-2 pks_justify-end pks_w-full">
          <motion.button
            onClick={toggleOpen}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-50/10 hover:pks_bg-white/80 pks_p-1 pks_group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CloseIcon
              className="pks_opacity-75 pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-white dark:pks_text-gray-300 group-hover:pks_text-red-600 "
              strokeWidth={2}
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toggelScreen();
            }}
            className="pks_w-[1.6rem] pks_h-[1.6rem] pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-50/10 hover:pks_bg-white/80 pks_p-1 pks_group"
            aria-label="Maximize"
          >
            {isMaximize ? (
              <ChevronsRightLeftIcon
                className="pks_opacity-75 pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-white dark:pks_text-gray-300 group-hover:pks_text-blue-600  pks_-rotate-45"
                strokeWidth={2}
              />
            ) : (
              <ChevronsLeftRightIcon
                className="pks_opacity-75 pks_w-5 pks_h-5 pks_flex pks_items-center pks_justify-center pks_rounded-full pks_text-white dark:pks_text-gray-300 group-hover:pks_text-blue-600  pks_-rotate-45"
                strokeWidth={2}
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
