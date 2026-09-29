import { fireEvent, render, screen } from "@testing-library/react";
import { RestartConversationPanel } from "./RestartConversationPanel";

describe("RestartConversationPanel", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: class {
        observe() {}
        disconnect() {}
      },
    });
  });

  it("requires explicit confirmation before restarting", () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    render(
      <RestartConversationPanel
        isRestarting={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Cancel" }).parentElement
        ?.parentElement,
    ).toHaveClass("cds--btn-set--fluid");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Restart conversation" }),
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables both actions while restarting", () => {
    render(
      <RestartConversationPanel
        isRestarting
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Restarting…" })).toBeDisabled();
  });
});
