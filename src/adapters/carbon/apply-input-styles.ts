const STYLE_ID = "rapida-chat-input-style";
const INPUT_STYLE = `
  .cds-aichat--text-area .cds-aichat--text-area-textarea,
  .cds-aichat--text-area .cds-aichat--text-area-sizer,
  .cds-aichat--text-area-placeholder {
    font-size: var(--cds-body-01-font-size, 0.875rem) !important;
    line-height: var(--cds-body-01-line-height, 1.42857) !important;
    letter-spacing: var(--cds-body-01-letter-spacing, 0.16px) !important;
  }

  .rapida-text-voice-action {
    order: -1;
    color: var(--cds-interactive);
  }
`;

export function applyCarbonInputStyles(rootDocument: Document = document): void {
  rootDocument
    .querySelectorAll("cds-aichat-react, cds-aichat-custom-element")
    .forEach((element) => {
      const root = element.shadowRoot;
      if (!root) return;

      let style = root.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!style) {
        style = rootDocument.createElement("style");
        style.id = STYLE_ID;
        root.appendChild(style);
      }
      style.textContent = INPUT_STYLE;
    });
}
