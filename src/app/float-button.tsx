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
        dir(err);
        dir(gur);
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
    <div className="fixed bottom-10 right-10">
      <div
        onClick={toggleChat}
        className={cn(
          "cursor-pointer rounded-full transform hover:scale-110 transition-transform duration-300 ease-in-out",
          "h-14 w-14 flex-shrink-0 flex items-center justify-center p-0.5 shadow-lg",
          "bg-white dark:bg-slate-800 border dark:border-gray-800"
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
            "fixed bottom-28 right-10 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl",
            "dark:text-gray-300 text-gray-700",
            "border dark:border-gray-300",
            isExpand ? "w-[500px] h-[600px]" : "w-[400px] h-[600px]",
            "transition-all duration-300 ease-in-out",
            "flex flex-col",
            isOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
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
      icon = <ChevronDownIcon strokeWidth={2.5} className="dark:text-white" />;
    } else if (loadingAssistant) {
      icon = <Spinner size="sm" />;
    } else if (appIcon) {
      icon = (
        <img
          className="w-full h-full object-cover rounded-full"
          alt="Assistant Icon"
          src={appIcon}
        />
      );
    } else {
      icon = <RapidaIcon className="h-8 w-8 text-blue-600" />;
    }

    // Smooth transition between icons
    setCurrentIcon(null); // Temporarily hide the icon for fade-out effect
    const timeoutId = setTimeout(() => setCurrentIcon(icon), 50); // Adjust timing for smoothness

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or prop change
  }, [isOpen, loadingAssistant, appIcon]);

  return (
    <div
      className={cn(
        "transition-opacity duration-100 ease-in-out",
        currentIcon ? "opacity-100" : "opacity-0"
      )}
    >
      {currentIcon}
    </div>
  );
};
