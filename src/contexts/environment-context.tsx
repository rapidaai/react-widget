import { ASSISTANT_API } from "@/configs";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EnvironmentContextProps {
  assistantId?: string;
  assistantVersion: string | null;
  language: string | "en";
  apiBase?: string;
  token?: string;
  debug: boolean;
  user: {
    name: string;
    user_id: string;
    // any additional data that will be stored for the assistant
    meta?: Record<string, string>;
  };
  theme: {
    color: string;
  };
}

// Function to generate a random string
const RandomString = () => {
  return `web_agent_${uuidv4()}`;
};

// Create the context with default values
export const EnvironmentContext = createContext<EnvironmentContextProps>({
  assistantId: window.chatbotConfig?.assistant_id,
  apiBase: window.chatbotConfig?.api_base
    ? window.chatbotConfig?.api_base
    : "https://assistant-01.rapida.ai",
  assistantVersion: window.chatbotConfig?.assistant_version
    ? window.chatbotConfig?.assistant_version
    : null,
  token: window.chatbotConfig?.token,
  debug: window.chatbotConfig?.debug || false,
  language: window.chatbotConfig?.language || "en",
  user: {
    ...window.chatbotConfig?.user,
    name: window.chatbotConfig?.user?.name || "Guest",
    user_id: window.chatbotConfig?.user?.user_id || RandomString(),
  },
  theme: {
    color: window.chatbotConfig?.theme?.color || "#2663eb",
  },
});

export const EnvironmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [language, setLanguage] = useState(
    window.chatbotConfig?.language || "en"
  );

  const userId = useCallback((userId?: string): string => {
    // Check if the user_id exists in local storage
    if (userId) return userId;
    let storedUserId = localStorage.getItem("rpd__uuid");
    if (!storedUserId) {
      // Generate a new user_id and store it in local storage
      storedUserId = RandomString(); // Generate a 12-character random string
      localStorage.setItem("rpd__uuid", storedUserId);
    }
    return storedUserId;
  }, []);

  const defaultMeta = (meta?: Record<string, string>) => {
    const defaultMeta = { source: "web plugin" };
    return meta ? { ...defaultMeta, ...meta } : defaultMeta;
  };

  useEffect(() => {
    const observeHtmlLang = (callback: any) => {
      const targetNode = document.documentElement;
      const config = { attributes: true, attributeFilter: ["lang"] };

      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "lang"
          ) {
            const newLang = targetNode.lang;
            callback(newLang);
          }
        }
      });

      observer.observe(targetNode, config);
      callback(targetNode.lang);
      return () => observer.disconnect();
    };

    const handleLanguageChange = (newLang: string) => {
      if (window.chatbotConfig) {
        window.chatbotConfig.language = newLang;
      }
      setLanguage(newLang);
    };

    const stopObserving = observeHtmlLang(handleLanguageChange);

    // Cleanup function
    return stopObserving;
  }, []);
  return (
    <EnvironmentContext.Provider
      value={{
        assistantId: window.chatbotConfig?.assistant_id,
        apiBase: ASSISTANT_API,
        assistantVersion: window.chatbotConfig?.assistant_version
          ? window.chatbotConfig?.assistant_version
          : null,
        token: window.chatbotConfig?.token,
        language,
        debug: window.chatbotConfig?.debug || false,
        user: {
          ...window.chatbotConfig?.user,
          name: window.chatbotConfig?.user?.name || "Guest",
          user_id:
            window.chatbotConfig?.user?.user_id ||
            userId(window.chatbotConfig?.user?.user_id),
          meta: defaultMeta(window.chatbotConfig?.user?.meta),
        },
        theme: {
          color: window.chatbotConfig?.theme?.color || "#2663eb",
        },
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
