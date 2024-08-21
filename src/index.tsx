import React from "react";
import ReactDOM from "react-dom/client";
import { DarkModeProvider } from "@/app/contexts/dark-mode-context";
import { EnvironmentProvider } from "@/app/contexts/environment-context";
import { App } from "@/app/app";
import "@/app/app/index.css";

const rootElementId = "rapida-chat-app";
let rootElement = document.getElementById(rootElementId);

if (!rootElement) {
  rootElement = document.createElement("div");
  rootElement.id = rootElementId;
  document.body.appendChild(rootElement);
}

// Create root and render the React component
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <EnvironmentProvider>
        <App />
      </EnvironmentProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
