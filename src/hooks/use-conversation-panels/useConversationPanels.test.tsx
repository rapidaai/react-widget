import { act, renderHook } from "@testing-library/react";
import { useConversationPanels } from "./useConversationPanels";

describe("useConversationPanels", () => {
  function setup() {
    const restartPanel = {
      open: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };
    const historyPanel = {
      open: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };
    const restartConversation = jest.fn().mockResolvedValue(undefined);
    const chatInstance = {
      messaging: { restartConversation },
      on: jest.fn(),
      off: jest.fn(),
      customPanels: {
        getPanel: jest.fn((type) =>
          type === "history" ? historyPanel : restartPanel,
        ),
      },
    } as any;
    const onBeforeRestart = jest.fn().mockResolvedValue(undefined);
    const onAfterRestart = jest.fn().mockResolvedValue(undefined);
    const onOpenHistory = jest.fn().mockResolvedValue(undefined);
    const onSelectConversation = jest.fn().mockResolvedValue(undefined);
    const hook = renderHook(() =>
      useConversationPanels({
        chatInstance,
        onBeforeRestart,
        onAfterRestart,
        onOpenHistory,
        onSelectConversation,
      }),
    );

    return {
      ...hook,
      chatInstance,
      historyPanel,
      restartPanel,
      restartConversation,
      onBeforeRestart,
      onAfterRestart,
      onOpenHistory,
      onSelectConversation,
    };
  }

  it("opens and closes Carbon's restart confirmation panel", async () => {
    const { result, restartPanel } = setup();

    await act(() => result.current.openRestartPanel());
    expect(result.current.isRestartPanelOpen).toBe(true);
    expect(restartPanel.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Restart conversation",
        showFrame: false,
        fullWidth: true,
      }),
    );

    await act(() => result.current.closeRestartPanel());
    expect(restartPanel.close).toHaveBeenCalled();
    expect(result.current.isRestartPanelOpen).toBe(false);
  });

  it("restarts only after confirmation", async () => {
    const {
      result,
      restartPanel,
      restartConversation,
      onBeforeRestart,
      onAfterRestart,
    } = setup();

    await act(() => result.current.openRestartPanel());
    expect(restartConversation).not.toHaveBeenCalled();

    await act(() => result.current.confirmRestart());
    expect(onBeforeRestart).toHaveBeenCalled();
    expect(restartPanel.close).toHaveBeenCalled();
    expect(restartConversation).toHaveBeenCalled();
    expect(onAfterRestart).toHaveBeenCalled();
    expect(result.current.isRestarting).toBe(false);
  });

  it("opens history and routes new conversation through confirmation", async () => {
    const { result, historyPanel, restartPanel, onOpenHistory } = setup();

    await act(() => result.current.openHistoryPanel());
    expect(historyPanel.open).toHaveBeenCalled();
    expect(onOpenHistory).toHaveBeenCalled();

    await act(() => result.current.startConversationFromHistory());
    expect(historyPanel.close).toHaveBeenCalled();
    expect(restartPanel.open).toHaveBeenCalled();
  });

  it("stops voice and restores a selected conversation", async () => {
    const {
      result,
      historyPanel,
      onBeforeRestart,
      onSelectConversation,
    } = setup();
    const entry = { id: "42", title: "Past conversation" };

    await act(() => result.current.selectConversation(entry));

    expect(onBeforeRestart).toHaveBeenCalled();
    expect(onSelectConversation).toHaveBeenCalledWith(entry);
    expect(historyPanel.close).toHaveBeenCalled();
  });

  it("tracks Carbon-driven panel closure and removes the listener", async () => {
    const { result, chatInstance, unmount } = setup();
    const closeHandler = chatInstance.on.mock.calls[0][0];

    await act(() => result.current.openRestartPanel());
    act(() => closeHandler.handler());
    expect(result.current.isRestartPanelOpen).toBe(false);

    unmount();
    expect(chatInstance.off).toHaveBeenCalledWith(closeHandler);
  });

  it("restores closed state when Carbon cannot open the restart panel", async () => {
    const { result, restartPanel } = setup();
    restartPanel.open.mockRejectedValueOnce(new Error("Panel failed"));

    await expect(
      act(() => result.current.openRestartPanel()),
    ).rejects.toThrow("Panel failed");
    expect(result.current.isRestartPanelOpen).toBe(false);
  });

  it("safely ignores panel actions before the chat instance is ready", async () => {
    const { result } = renderHook(() =>
      useConversationPanels({ chatInstance: null }),
    );

    await act(() => result.current.openRestartPanel());
    await act(() => result.current.closeRestartPanel());
    await act(() => result.current.confirmRestart());
    expect(result.current.isRestartPanelOpen).toBe(false);
  });
});
