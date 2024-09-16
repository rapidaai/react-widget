import { cn } from "@/styles/media";
import React, { FC } from "react";

export const MicLoader: FC<{ isRecording: boolean }> = ({ isRecording }) => {
  return (
    <div className="pks_h-16 pks_loader pks_relative pks_aspect-[1]">
      <div className="pks_absolute pks_z-[10] pks_top-0 pks_right-0 pks_left-0 pks_bottom-0 pks_flex pks_justify-center pks_items-center">
        <div
          className={cn(
            "pks_flex pks_items-center pks_justify-center",
            "pks_h-10 pks_w-10 pks_rounded-full pks_p-2",
            "pks_text-white",
            isRecording
              ? "pks_bg-red-500 pks_text-white"
              : "pks_bg-blue-500 pks_text-white"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            className="pks_w-5 pks_h-5 pks_mx-auto"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </div>
      </div>
      {isRecording && (
        <>
          <div className="pks_absolute pks_animate-rippleCustom2s pks_shadow-lg pks_bg-red-600/30 pks_backdrop-blur pks_backdrop-opacity-20 pks_z-[2] pks_rounded-full pks_border-[.1px] pks_flex pks_items-center !pks_border-gray-500/10 !pks_duration-[0.2s] pks_p-1 pks_inset-[20%]"></div>
          <div className="pks_absolute pks_animate-rippleCustom3s pks_shadow-lg pks_bg-red-600/20 pks_backdrop-blur pks_backdrop-opacity-20 pks_z-[2] pks_rounded-full pks_border-[.1px] pks_flex pks_items-center !pks_border-gray-500/10 !pks_duration-[0.2s] pks_p-1 pks_inset-[10%]"></div>
          <div className="pks_absolute pks_animate-rippleCustom-4s pks_shadow-lg pks_bg-gray-600/10 pks_z-[1] pks_rounded-full pks_border-[0.1px] pks_flex pks_items-center !pks_border-gray-600/10 !pks_duration-[0.4s] pks_p-1 pks_inset-[0%]"></div>
        </>
      )}
    </div>
  );
};
