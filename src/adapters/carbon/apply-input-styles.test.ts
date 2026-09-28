import { applyCarbonInputStyles } from "./apply-input-styles";

describe("applyCarbonInputStyles", () => {
  it("installs one typography style in each Carbon shadow root", () => {
    const host = document.createElement("cds-aichat-react");
    const shadowRoot = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);

    applyCarbonInputStyles();
    applyCarbonInputStyles();

    const styles = shadowRoot.querySelectorAll("#rapida-chat-input-style");
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent).toContain("0.875rem");
    expect(styles[0].textContent).toContain(".rapida-text-voice-action");
    host.remove();
  });

  it("ignores Carbon hosts without an open shadow root", () => {
    const host = document.createElement("cds-aichat-react");
    document.body.appendChild(host);

    expect(() => applyCarbonInputStyles()).not.toThrow();

    host.remove();
  });
});
