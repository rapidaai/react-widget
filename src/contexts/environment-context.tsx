import React, { createContext, useContext } from "react";

interface EnvironmentContextProps {
  assistantId?: string;
  assistantVersion: string | null;
  apiBase?: string;
  token?: string;
  debug: boolean;
  user: {
    name: string;
    user_id?: string;
    // any additional data that will be stored for the assistatant
    meta?: Record<string, string>;
  };
}

export const EnvironmentContext = createContext<EnvironmentContextProps>({
  assistantId: window.chatbotConfig?.assistant_id,
  apiBase: window.chatbotConfig?.api_base
    ? window.chatbotConfig?.api_base
    : "https://assistant.rapida.ai",
  assistantVersion: window.chatbotConfig?.assistant_version
    ? window.chatbotConfig?.assistant_version
    : null,
  token: window.chatbotConfig?.token,
  debug: window.chatbotConfig?.debug || false,
  user: window.chatbotConfig?.user || { name: "Guest" },
});

export const EnvironmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <EnvironmentContext.Provider
      value={{
        assistantId: window.chatbotConfig?.assistant_id,
        apiBase: window.chatbotConfig?.api_base
          ? window.chatbotConfig?.api_base
          : "https://assistant.rapida.ai",
        assistantVersion: window.chatbotConfig?.assistant_version
          ? window.chatbotConfig?.assistant_version
          : null,
        token: window.chatbotConfig?.token,
        debug: window.chatbotConfig?.debug || false,
        user: window.chatbotConfig?.user || { name: "Guest" },
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
