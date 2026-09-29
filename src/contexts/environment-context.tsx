import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_ASSISTANT_API } from "@/configs";

export interface EnvironmentContextValue {
  assistantId?: string;
  assistantVersion: string | null;
  language: string;
  apiBase: string;
  token?: string;
  debug: boolean;
  user: {
    name: string;
    user_id: string;
    meta: Record<string, string>;
  };
  theme: {
    mode: "light" | "dark" | "system";
  };
}

const DEFAULT_ENVIRONMENT: EnvironmentContextValue = {
  assistantVersion: null,
  language: "en",
  apiBase: DEFAULT_ASSISTANT_API,
  debug: false,
  user: {
    name: "Guest",
    user_id: "",
    meta: { source: "web plugin" },
  },
  theme: { mode: "light" },
};

export const EnvironmentContext =
  createContext<EnvironmentContextValue>(DEFAULT_ENVIRONMENT);

function getOrCreateUserId(configuredUserId?: string): string {
  if (configuredUserId) return configuredUserId;

  const storedUserId = localStorage.getItem("rpd__uuid");
  if (storedUserId) return storedUserId;

  const generatedUserId = `web_agent_${uuidv4()}`;
  localStorage.setItem("rpd__uuid", generatedUserId);
  return generatedUserId;
}

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const config = window.chatbotConfig;
  const [language, setLanguage] = useState(config?.language || "en");
  const [userId] = useState(() => getOrCreateUserId(config?.user?.user_id));

  useEffect(() => {
    const html = document.documentElement;
    const updateLanguage = () => {
      const nextLanguage = html.lang.trim();
      if (!nextLanguage) return;
      if (window.chatbotConfig) window.chatbotConfig.language = nextLanguage;
      setLanguage(nextLanguage);
    };
    const observer = new MutationObserver(updateLanguage);

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    updateLanguage();

    return () => observer.disconnect();
  }, []);

  const value = useMemo<EnvironmentContextValue>(
    () => ({
      assistantId: config?.assistant_id,
      apiBase: config?.api_base || DEFAULT_ASSISTANT_API,
      assistantVersion: config?.assistant_version || null,
      token: config?.token,
      language,
      debug: config?.debug || false,
      user: {
        ...config?.user,
        name: config?.user?.name || "Guest",
        user_id: userId,
        meta: { source: "web plugin", ...config?.user?.meta },
      },
      theme: { mode: config?.theme?.mode || "light" },
    }),
    [config, language, userId],
  );

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}
