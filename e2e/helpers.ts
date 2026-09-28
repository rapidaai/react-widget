import { Page, expect } from "@playwright/test";

export async function gotoWidget(page: Page) {
  await page.goto("/");
  await page.waitForSelector("#rapida-chat-app", { state: "attached" });
}

export async function waitForWidgetReady(page: Page) {
  await page.waitForSelector("cds-aichat-react, cds-aichat-custom-element", {
    state: "attached",
    timeout: 10000,
  });
}

export async function openChat(page: Page) {
  const launcher = page.locator(".cds-aichat--launcher");
  if (await launcher.isVisible()) {
    await launcher.click();
  }
  await page.waitForSelector("cds-aichat-react, cds-aichat-custom-element", {
    state: "visible",
  });
}

export async function sendTextMessage(page: Page, text: string) {
  const input = page.locator(
    "cds-aichat-react [contenteditable='true'], cds-aichat-custom-element [contenteditable='true']",
  );
  await input.click();
  await input.fill(text);
  await page.keyboard.press("Enter");
}

export async function waitForAssistantResponse(page: Page, timeout = 30000) {
  await page.waitForSelector(
    ".cds-aichat--message--assistant, .cds-aichat--message--user",
    { state: "visible", timeout },
  );
}

export async function getMessages(page: Page) {
  return page.locator(".cds-aichat--message").all();
}

export async function isVoiceMode(page: Page): Promise<boolean> {
  return page.locator("[data-testid='message-input-controls']").isVisible();
}

export async function clickVoiceButton(page: Page) {
  const voiceButton = page.locator(
    "cds-aichat-react [aria-label='Voice'], cds-aichat-custom-element [aria-label='Voice']",
  );
  await voiceButton.click();
}

export async function clickTextButton(page: Page) {
  const textButton = page.locator(
    "cds-aichat-react [aria-label='Text'], cds-aichat-custom-element [aria-label='Text']",
  );
  await textButton.click();
}

export async function clickStopButton(page: Page) {
  const stopButton = page.locator(
    "cds-aichat-react [aria-label='Stop'], cds-aichat-custom-element [aria-label='Stop']",
  );
  await stopButton.click();
}

export async function isAudioPanelVisible(page: Page): Promise<boolean> {
  return page.locator(".rapida-audio").isVisible();
}

export async function isTextVoiceActionVisible(page: Page): Promise<boolean> {
  return page.locator("[aria-label='Voice']").isVisible();
}
