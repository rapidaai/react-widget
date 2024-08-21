import React, { createContext, useContext } from "react";

interface EnvironmentContextProps {
  assistantId?: string;
  token?: string;
  debug: boolean;
}

export const EnvironmentContext = createContext<EnvironmentContextProps>({
  assistantId: window.chatbotConfig?.assistantId,
  token: window.chatbotConfig?.token,
  debug: window.chatbotConfig?.debug || false,
});

export const EnvironmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <EnvironmentContext.Provider
      value={{
        assistantId: window.chatbotConfig?.assistantId,
        token: window.chatbotConfig?.token,
        debug: window.chatbotConfig?.debug || false,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
