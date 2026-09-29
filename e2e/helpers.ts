import { Page, expect } from "@playwright/test";

export async function gotoWidget(page: Page) {
  await page.goto("/");
  await page.waitForSelector("#rapida-chat-app", { state: "attached" });
}

export async function waitForWidgetReady(page: Page) {
  await expect(
    page.getByRole("button", { name: "Open the chat window" }),
  ).toBeVisible({ timeout: 10000 });
}

export async function openChat(page: Page) {
  await page
    .getByRole("button", { name: "Open the chat window" })
    .click();
  await expect(
    page.getByRole("button", { name: "Close the chat window" }),
  ).toBeVisible();
}

export async function sendTextMessage(page: Page, text: string) {
  const input = page.getByRole("textbox", { name: "Write your prompt" });
  await input.click();
  await input.fill(text);
  await page.keyboard.press("Enter");
}

export async function clickVoiceButton(page: Page) {
  const voiceButton = page.getByRole("button", { name: "Voice", exact: true });
  await voiceButton.click();
}

export async function clickTextButton(page: Page) {
  const textButton = page.getByRole("button", { name: "Text", exact: true });
  await textButton.click();
}

export async function clickStopButton(page: Page) {
  const stopButton = page.getByRole("button", { name: "Stop", exact: true });
  await stopButton.click();
}

export async function isAudioPanelVisible(page: Page): Promise<boolean> {
  return page.locator(".rapida-audio").isVisible();
}

export async function isTextVoiceActionVisible(page: Page): Promise<boolean> {
  return page.getByRole("button", { name: "Voice", exact: true }).isVisible();
}
