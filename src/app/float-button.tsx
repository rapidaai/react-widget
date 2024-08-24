import { ChatterBox } from "@/app/app/components/chatter-box";
import { Spinner } from "@/app/app/components/loaders/spinner";
import { GetAssistant } from "@/app/clients/assistant";
import { GetAssistantResponse } from "@/app/clients/protos/assistant-api_pb";
import { useAssistantChat } from "@/app/hooks/use-assistant-chat";
import { useEnvironment } from "@/app/hooks/use-environment";
import { useDebugger, useLogger } from "@/app/hooks/use-logger";
import { ChevronDownIcon } from "@/app/icons/chevron-down";
import { RapidaIcon } from "@/app/icons/rapida";
import { cn } from "@/app/styles/media";
import React, { useCallback, useEffect, useState } from "react";

export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const { assistantId, assistantVersion, token, debug } = useEnvironment();
  const [loadingAssistant, setLoadingAssistant] = useState<boolean>(true);

  /**
   *
   */
  const log = useLogger();
  const { dir } = useDebugger();
  const ctx = useAssistantChat();

  /**
   *
   */
  const aftergetassistant = useCallback(
    (err: any | null, gur: GetAssistantResponse | null) => {
      dir(err);
      dir(gur);
      setLoadingAssistant(false);
      if (gur?.getSuccess()) {
        log(gur.getData());
        const as = gur.getData();
        if (as) {
          ctx.onChangeCurrentAssistant(as);
        }
      } else {
        let errorMessage = gur?.getError();
        if (errorMessage) {
          log(errorMessage.getHumanmessage());
          return;
        }
        log("Unable to get your assistants, please try again later.");
      }
    },
    []
  );

  /**
   *
   */
  useEffect(() => {
    if (!assistantId) {
      console.error(
        "Please provide an assistant_id for initialize the assistant."
      );
      return;
    }
    if (!token) {
      console.error(
        "Please provide an authentication token for initialize the assistant."
      );
      return;
    }

    let assistantProviderModelId = null;
    if (assistantVersion) {
      assistantProviderModelId = assistantVersion;
    }
    // x-api-key
    GetAssistant(assistantId, assistantProviderModelId, aftergetassistant, {
      "x-api-key": token,
    });
  }, [assistantId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="pks_fixed pks_bottom-10 pks_right-10">
      <div
        onClick={toggleChat}
        className={cn(
          "pks_cursor-pointer pks_rounded-full pks_transform pks_hover:scale-110 pks_transition-transform pks_duration-300 pks_ease-in-out",
          "pks_h-14 pks_w-14 pks_flex-shrink-0 pks_flex pks_items-center pks_justify-center pks_p-0.5 pks_shadow-lg",
          "pks_bg-white dark:pks_bg-slate-800 pks_border dark:pks_border-gray-800"
        )}
      >
        <FloatButtonIcon
          isOpen={isOpen}
          loadingAssistant={loadingAssistant}
          appIcon={ctx.currentAssistant
            ?.getAppappearance()
            ?.getFieldsMap()
            ?.get("appIcon")
            ?.getStringValue()}
        />
      </div>
      {ctx.currentAssistant && (
        <div
          className={cn(
            "pks_fixed pks_bottom-28 pks_right-10 pks_w-80 pks_bg-white dark:pks_bg-gray-900 pks_rounded-lg pks_shadow-xl",
            "dark:pks_text-gray-300 pks_text-gray-700",
            "pks_border dark:pks_border-gray-300",
            isExpand
              ? "pks_w-[500px] pks_h-[600px]"
              : "pks_w-[400px] pks_h-[600px]",
            "pks_transition-all pks_duration-300 pks_ease-in-out",
            "pks_flex pks_flex-col",
            isOpen
              ? "pks_opacity-100 pks_scale-100"
              : "pks_opacity-0 pks_scale-95 pks_pointer-events-none"
          )}
        >
          <ChatterBox
            assistant={ctx.currentAssistant}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

const FloatButtonIcon = ({
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
    <div
      className={cn(
        "pks_transition-opacity pks_duration-100 pks_ease-in-out",
        currentIcon ? "pks_opacity-100" : "pks_opacity-0"
      )}
    >
      {currentIcon}
    </div>
  );
};
