import { FC } from "react";
import { CloseIcon } from "@/icons/close";
import { ChevronsRightLeftIcon } from "@/icons/chevrons-right-left";
import { ChevronsLeftRightIcon } from "@/icons/chevrons-left-right";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/styles/media";
import { useEnvironment } from "@/hooks/use-environment";
import { AgentWebpluginDeployment } from "rapida-react";

export const Header: FC<{
  deployment: AgentWebpluginDeployment;
  isMaximize: boolean;
  toggleOpen: () => void;
  toggelScreen: () => void;
}> = ({ deployment, toggleOpen, toggelScreen, isMaximize }) => {
  const location = useLocation();
  const { pathname } = location;
  const { theme } = useEnvironment();
  return (
    <div
      style={{
        background: theme.color,
      }}
      className={cn(
        "pks_text-white pks_flex pks_flex-col pks_justify-between pks_space-x-1.5 pks_sticky pks_top-0 pks_z-20 md:pks_rounded-t-xl"
      )}
    >
      <div
        className={cn(
          "pks_flex pks_items-center pks_space-x-2 pks_px-4 pks_py-3 pks_w-full"
        )}
      >
        <div className="pks_flex pks_justify-between pks_w-full">
          <div className="pks_flex pks_items-center pks_justify-center pks_py-1">
            {/* <NavLink
              to="/chat"
              className={cn(
                pathname.includes("/chat") &&
                  "pks_bg-white/20 pks_backdrop-blur-md ",
                "pks_flex pks_space-x-1.5 pks_p-1 pks_rounded-full pks_px-4 pks_items-center pks_cursor-pointer"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="pks_h-[14px] pks_w-[14px]"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>

              <span className="pks_text-[14px]">Chat</span>
            </NavLink>
            <NavLink
              to="/help"
              className={cn(
                pathname.includes("/help") &&
                  "pks_bg-white/20 pks_backdrop-blur-md ",
                "pks_flex pks_space-x-1.5 pks_p-1 pks_rounded-full pks_px-4 pks_items-center pks_cursor-pointer"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="pks_h-[14px] pks_w-[14px]"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
              <span className="pks_text-[14px]">Help</span>
            </NavLink> */}
          </div>
          <div className="pks_flex pks_space-x-2 pks_items-center">
            <button
              onClick={toggleOpen}
              className="pks_h-fit pks_p-2 pks_w-fit pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-50/10 hover:pks_bg-white/20"
            >
              <CloseIcon
                className="pks_opacity-75 pks_w-4 pks_h-4 pks_flex pks_items-center pks_justify-center pks_rounded-full  group-hover:pks_text-red-600 "
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={() => {
                toggelScreen();
              }}
              className="pks_h-fit pks_p-2 pks_w-fit pks_flex pks_items-center pks_justify-center pks_rounded-full pks_bg-gray-50/10 hover:pks_bg-white/20"
              aria-label="Maximize"
            >
              {isMaximize ? (
                <ChevronsRightLeftIcon
                  className="pks_opacity-75 pks_w-4 pks_h-4 pks_flex pks_items-center pks_justify-center pks_rounded-full  group-hover:pks_text-blue-600  pks_-rotate-45"
                  strokeWidth={2.5}
                />
              ) : (
                <ChevronsLeftRightIcon
                  className="pks_opacity-75 pks_w-4 pks_h-4 pks_flex pks_items-center pks_justify-center pks_rounded-full  group-hover:pks_text-blue-600  pks_-rotate-45"
                  strokeWidth={2.5}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
