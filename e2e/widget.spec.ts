import { test, expect } from "@playwright/test";
import {
  gotoWidget,
  waitForWidgetReady,
  openChat,
  sendTextMessage,
  waitForAssistantResponse,
  getMessages,
  isVoiceMode,
  clickVoiceButton,
  clickTextButton,
  clickStopButton,
  isAudioPanelVisible,
  isTextVoiceActionVisible,
} from "./helpers";

test.describe("Widget Loading", () => {
  test("should load the widget", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    const widget = page.locator("cds-aichat-react, cds-aichat-custom-element");
    await expect(widget).toBeAttached();
  });

  test("should display assistant name in header", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    const header = page.locator(
      "cds-aichat-react .cds-aichat--header, cds-aichat-custom-element .cds-aichat--header",
    );
    await expect(header).toBeVisible();
  });
});

test.describe("Text Messaging", () => {
  test("should send a text message and receive response", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await sendTextMessage(page, "Hello");
    await waitForAssistantResponse(page);

    const messages = await getMessages(page);
    expect(messages.length).toBeGreaterThan(0);
  });

  test("should show welcome message on empty send", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    const input = page.locator(
      "cds-aichat-react [contenteditable='true'], cds-aichat-custom-element [contenteditable='true']",
    );
    await input.click();
    await page.keyboard.press("Enter");

    await page.waitForTimeout(1000);

    const welcomeMessage = page.locator("text=/hello|hi|hey|greetings/i");
    await expect(welcomeMessage.first()).toBeVisible();
  });
});

test.describe("Voice Mode", () => {
  test("should toggle to voice mode", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(500);

    const audioVisible = await isAudioPanelVisible(page);
    expect(audioVisible).toBe(true);
  });

  test("should toggle back to text mode", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(500);

    await clickTextButton(page);
    await page.waitForTimeout(500);

    const textVisible = await isTextVoiceActionVisible(page);
    expect(textVisible).toBe(true);
  });

  test("should show connecting state", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);

    const connectingText = page.locator("text=/connecting/i");
    await expect(connectingText.first()).toBeVisible({ timeout: 5000 });
  });

  test("should show listening state after connect", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);

    const listeningText = page.locator("text=/listening/i");
    await expect(listeningText.first()).toBeVisible({ timeout: 10000 });
  });

  test("should disconnect when stop is clicked", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(1000);

    await clickStopButton(page);
    await page.waitForTimeout(500);

    const textVisible = await isTextVoiceActionVisible(page);
    expect(textVisible).toBe(true);
  });
});

test.describe("Audio Controls", () => {
  test("should show mute button in audio panel", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(500);

    const muteButton = page.locator(
      "cds-aichat-react [aria-label='Mute'], cds-aichat-custom-element [aria-label='Mute']",
    );
    await expect(muteButton).toBeVisible({ timeout: 10000 });
  });

  test("should show device selector when devices available", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(1000);

    const deviceSelector = page.locator(
      "cds-aichat-react [aria-label='Select Microphone'], cds-aichat-custom-element [aria-label='Select Microphone']",
    );
    await expect(deviceSelector).toBeVisible({ timeout: 10000 });
  });

  test("should show frequency bars", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(500);

    const bars = page.locator(".rapida-audio__frequency-bars");
    await expect(bars).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Layout Modes", () => {
  test("should render floating layout", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);

    const launcher = page.locator(".cds-aichat--launcher");
    await expect(launcher).toBeVisible();
  });

  test("should open chat from launcher", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);

    const launcher = page.locator(".cds-aichat--launcher");
    await launcher.click();

    const chat = page.locator("cds-aichat-react, cds-aichat-custom-element");
    await expect(chat).toBeVisible();
  });
});
