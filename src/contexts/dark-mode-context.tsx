import React, { createContext, useContext, useState } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: (theme: "light" | "dark") => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

export const DarkModeProvider: React.FC<{ children?: any }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Use localStorage or any other persistent storage to get the initial dark mode preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    } else {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });

  const toggleDarkMode = (theme: "light" | "dark") => {
    setIsDarkMode(theme === "dark");
    localStorage.setItem("theme", theme); // Store the theme preference in localStorage
    let htmlSelector = document.querySelector("html");
    if (htmlSelector) {
      htmlSelector.classList.remove("light", "dark");
      htmlSelector.classList.add(theme);
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
