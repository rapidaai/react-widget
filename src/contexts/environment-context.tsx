import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EnvironmentContextProps {
  assistantId?: string;
  assistantVersion: string | null;
  apiBase?: string;
  token?: string;
  debug: boolean;
  user: {
    name: string;
    user_id: string;
    // any additional data that will be stored for the assistant
    meta?: Record<string, string>;
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
    : "https://assistant.rapida.ai",
  assistantVersion: window.chatbotConfig?.assistant_version
    ? window.chatbotConfig?.assistant_version
    : null,
  token: window.chatbotConfig?.token,
  debug: window.chatbotConfig?.debug || false,
  user: {
    ...window.chatbotConfig?.user,
    name: window.chatbotConfig?.user?.name || "Guest",
    user_id: window.chatbotConfig?.user?.user_id || RandomString(),
  },
});

export const EnvironmentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userId, setUserId] = useState<string>(RandomString());

  useEffect(() => {
    // Check if the user_id exists in local storage
    let storedUserId = localStorage.getItem("rpd__uuid");
    if (!storedUserId) {
      // Generate a new user_id and store it in local storage
      storedUserId = RandomString(); // Generate a 12-character random string
      localStorage.setItem("rpd__uuid", storedUserId);
    }

    setUserId(storedUserId);
  }, []);

  const defaultMeta = (meta?: Record<string, string>) => {
    const defaultMeta = { source: "web plugin" };
    return meta ? { ...defaultMeta, ...meta } : defaultMeta;
  };

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
        user: {
          ...window.chatbotConfig?.user,
          name: window.chatbotConfig?.user?.name || "Guest",
          user_id: window.chatbotConfig?.user?.user_id || userId,
          meta: defaultMeta(window.chatbotConfig?.user?.meta),
        },
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};
