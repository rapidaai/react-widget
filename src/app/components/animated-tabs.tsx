import { cn } from "@/styles/media";
import { motion } from "framer-motion";
import { FC, ReactElement } from "react";

export const AnimatedTabs: FC<{
  tabs: { name: string; icon?: ReactElement }[];
  activeTab: string;
  setActiveTab: (n: string) => void;
}> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="pks_flex pks_border-b-[0.5px] pks_sticky pks_top-0 pks_z-10 pks_bg-white">
      {tabs.map((tab) => (
        <div
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={cn(
            activeTab === tab.name ? "pks_text-blue-600" : "pks_text-gray-500",
            "pks_px-4 pks_py-3 pks_flex pks_items-center pks_text-lg pks_relative pks_capitalize pks_cursor-pointer",
            "pks_opacity-90"
          )}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.name && (
            <motion.span
              layoutId="underline"
              className={cn(
                "pks_rounded-xl pks_absolute pks_h-0.5 pks_-bottom-[1.2px] pks_left-0 pks_right-0 pks_z-10 pks_bg-blue-600"
              )}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="pks_mr-1.5">{tab.icon}</span>
          <span className="pks_z-20 pks_capitalize">{tab.name}</span>
        </div>
      ))}
    </div>
  );
};
