import ReactDOM from "react-dom/client";
import { EnvironmentProvider } from "@/contexts/environment-context";
import { App } from "@/app";
import "@/styles/carbon.scss";

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
  <EnvironmentProvider>
    <App />
  </EnvironmentProvider>,
);
