import { Spinner } from "@/app/components/loaders/spinner";
import { ChevronDownIcon } from "@/icons/chevron-down";
import { RapidaIcon } from "@/icons/rapida";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/styles/media";

export const FloatButtonIcon = ({
  isOpen,
  loadingAssistant,
  appIcon,
}: {
  isOpen: boolean;
  loadingAssistant: boolean;
  appIcon: string | undefined;
}) => {
  const [currentIcon, setCurrentIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    let icon: JSX.Element;

    if (isOpen) {
      icon = (
        <ChevronDownIcon strokeWidth={2.5} className="dark:pks_text-white" />
      );
    } else if (loadingAssistant) {
      icon = <Spinner size="sm" />;
    } else if (appIcon) {
      icon = (
        <img
          className="pks_w-full pks_h-full pks_object-cover pks_rounded-full"
          alt="Assistant Icon"
          src={appIcon}
        />
      );
    } else {
      icon = <RapidaIcon className="pks_h-8 pks_w-8 pks_text-blue-600" />;
    }

    // Smooth transition between icons
    setCurrentIcon(null); // Temporarily hide the icon for fade-out effect
    const timeoutId = setTimeout(() => setCurrentIcon(icon), 50); // Adjust timing for smoothness

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or prop change
  }, [isOpen, loadingAssistant, appIcon]);

  return (
    <motion.button
      className={cn(
        "pks_flex-shrink-0 pks_flex pks_items-center pks_justify-center pks_p-0.5 pks_shadow-lg",
        "pks_border-[5px] pks_relative pks_transition-colors",
        "pks_ring-1 pks_ring-gray-300/50",
        "pks_bg-white pks_border-gray-200/30 dark:pks_bg-slate-800 dark:pks_border-gray-700/30 pks_rounded-full"
      )}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="pks_block pks_relative pks_z-10" data-open={isOpen}>
        <div
          className={cn(
            "pks_rounded-full pks_flex pks_items-center pks_justify-center pks_flex-shrink-0 pks_h-12 pks_w-12 pks_p-1",
            "pks_text-blue-600"
          )}
        >
          {currentIcon}
        </div>
      </span>
    </motion.button>
  );
};
