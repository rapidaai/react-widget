import { fireEvent, render, screen } from "@testing-library/react";
import { TextVoiceAction } from "./TextVoiceAction";

jest.mock("@carbon/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    Button: ({ iconDescription, renderIcon: _icon, ...props }: any) =>
      React.createElement("button", { ...props, "aria-label": iconDescription }),
  };
});
jest.mock("@carbon/icons-react", () => ({
  InProgress: () => null,
  VoiceMode: () => null,
}));

describe("TextVoiceAction", () => {
  it("starts voice and exposes its connecting state", () => {
    const onSelect = jest.fn();
    const { rerender } = render(
      <TextVoiceAction disabled={false} isConnecting={false} onSelect={onSelect} />,
    );
    const button = screen.getByRole("button", { name: "Voice" });
    expect(button).toHaveClass("rapida-text-voice-action");
    expect(button).not.toHaveAttribute("style");
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);

    rerender(<TextVoiceAction disabled={false} isConnecting onSelect={onSelect} />);
    expect(screen.getByRole("button", { name: "Connecting" })).toBeDisabled();
  });
});
