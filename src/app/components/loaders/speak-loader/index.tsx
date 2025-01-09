import { cn } from "@/styles/media";
import React, { FC } from "react";

export const SpeakLoader: FC<{ isRecording: boolean }> = ({ isRecording }) => {
  return (
    <div className=" pks_loader pks_relative pks_aspect-[1]">
      <div className="pks_absolute pks_z-[10] pks_top-0 pks_right-0 pks_left-0 pks_bottom-0 pks_flex pks_justify-center pks_items-center">
        <div
          className={cn(
            "pks_flex pks_items-center pks_justify-center",
            "pks_h-20 pks_w-10 pks_rounded-full pks_p-2",
            "pks_text-white",
            isRecording
              ? "pks_bg-blue-500 pks_text-white"
              : "pks_bg-blue-500 pks_text-white"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.2"
            stroke="currentColor"
            className="pks_w-5 pks_h-5 pks_mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        </div>
      </div>
      {isRecording && (
        <>
          <div className="pks_absolute pks_animate-rippleCustom2s pks_shadow-lg pks_bg-blue-600/30 pks_backdrop-blur pks_backdrop-opacity-20 pks_z-[2] pks_rounded-full pks_border-[.1px] pks_flex pks_items-center !pks_border-gray-500/10 !pks_duration-[0.2s] pks_p-1 pks_inset-[20%]"></div>
          <div className="pks_absolute pks_animate-rippleCustom3s pks_shadow-lg pks_bg-blue-600/20 pks_backdrop-blur pks_backdrop-opacity-20 pks_z-[2] pks_rounded-full pks_border-[.1px] pks_flex pks_items-center !pks_border-gray-500/10 !pks_duration-[0.2s] pks_p-1 pks_inset-[10%]"></div>
          <div className="pks_absolute pks_animate-rippleCustom-4s pks_shadow-lg pks_bg-gray-600/10 pks_z-[1] pks_rounded-full pks_border-[0.1px] pks_flex pks_items-center !pks_border-gray-600/10 !pks_duration-[0.4s] pks_p-1 pks_inset-[0%]"></div>
        </>
      )}
    </div>
  );
};
