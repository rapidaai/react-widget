import { fireEvent, render, screen } from "@testing-library/react";
import { DeviceSelector } from "./DeviceSelector";

jest.mock("@carbon/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
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
  Checkmark: () => null,
  SettingsAdjust: () => null,
}));

describe("DeviceSelector", () => {
  it("selects a microphone by device id", () => {
    const onDeviceChange = jest.fn();
    render(
      <DeviceSelector
        devices={[{ deviceId: "usb", label: "USB Microphone" }] as MediaDeviceInfo[]}
        activeDeviceId=""
        onDeviceChange={onDeviceChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "USB Microphone" }));
    expect(onDeviceChange).toHaveBeenCalledWith("usb");
  });
});
