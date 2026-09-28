import { fireEvent, render, screen } from "@testing-library/react";
import { AudioPanel } from "./AudioPanel";

jest.mock("@carbon/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    Button: ({ iconDescription, renderIcon: _icon, ...props }: any) =>
      React.createElement("button", { ...props, "aria-label": iconDescription }),
    OverflowMenu: ({ children, iconDescription }: any) =>
      React.createElement(
        "div",
        null,
        React.createElement("button", { "aria-label": iconDescription }),
        children,
      ),
    OverflowMenuItem: ({ itemText, onClick, title }: any) =>
      React.createElement("button", { onClick, title }, itemText),
  };
});
jest.mock("@carbon/icons-react", () => ({
  Chat: () => null,
  Checkmark: () => null,
  InProgress: () => null,
  Microphone: () => null,
  MicrophoneOff: () => null,
  SettingsAdjust: () => null,
  StopFilledAlt: () => null,
}));

describe("AudioPanel", () => {
  it("keeps voice actions available in one stable input row", () => {
    const onToggleMute = jest.fn();
    const onSwitchToText = jest.fn();
    const onStop = jest.fn();
    render(
      <AudioPanel
        isConnected
        isConnecting={false}
        isMuted={false}
        frequencies={[]}
        devices={[]}
        activeDeviceId=""
        onToggleMute={onToggleMute}
        onSwitchToText={onSwitchToText}
        onStop={onStop}
        onDeviceChange={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    fireEvent.click(screen.getByRole("button", { name: "Text" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(onToggleMute).toHaveBeenCalledTimes(1);
    expect(onSwitchToText).toHaveBeenCalledTimes(1);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
