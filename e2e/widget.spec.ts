import { test, expect } from "@playwright/test";
import {
  gotoWidget,
  waitForWidgetReady,
  openChat,
  sendTextMessage,
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
    await openChat(page);
    await expect(page.getByText("HeloAI Assistant").first()).toBeVisible();
  });
});

test.describe("Text Messaging", () => {
  test("should send a text message", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await sendTextMessage(page, "Hello");
    await expect(page.getByRole("heading", { name: "Hello" })).toBeVisible();
  });

  test("should ignore an empty message", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    const input = page.getByRole("textbox", { name: "Write your prompt" });
    await input.click();
    await page.keyboard.press("Enter");

    await expect(input).toBeEmpty();
    await expect(page.getByText("You said", { exact: true })).toHaveCount(0);
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

    const muteButton = page.getByRole("button", { name: "Mute", exact: true });
    await expect(muteButton).toBeVisible({ timeout: 10000 });
  });

  test("should show device selector when devices available", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);
    await openChat(page);

    await clickVoiceButton(page);
    await page.waitForTimeout(1000);

    const deviceSelector = page.getByRole("button", {
      name: "Select microphone",
      exact: true,
    });
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

    const launcher = page.getByRole("button", {
      name: "Open the chat window",
    });
    await expect(launcher).toBeVisible();
  });

  test("should open chat from launcher", async ({ page }) => {
    await gotoWidget(page);
    await waitForWidgetReady(page);

    const launcher = page.getByRole("button", {
      name: "Open the chat window",
    });
    await launcher.click();

    await expect(
      page.getByRole("button", { name: "Close the chat window" }),
    ).toBeVisible();
  });
});
