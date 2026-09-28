import { fireEvent, render, screen } from "@testing-library/react";
import { Channel } from "@rapidaai/react";
import { AudioControls, AudioControlsProps } from "./AudioControls";

jest.mock("@carbon/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  return {
    Button: ({ children, iconDescription, renderIcon: _icon, ...props }: any) =>
      React.createElement("button", { ...props, "aria-label": iconDescription }, children),
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
  VoiceMode: () => null,
}));

const actions = {
  onStartVoice: jest.fn(),
  onToggleMute: jest.fn(),
  onSwitchToText: jest.fn(),
  onStop: jest.fn(),
  onDeviceChange: jest.fn(),
};

const props: AudioControlsProps = {
  channel: Channel.Text,
  voiceEnabled: true,
  hasText: false,
  isConnected: false,
  isConnecting: false,
  isMuted: false,
  frequencies: [],
  transcript: "",
  devices: [],
  activeDeviceId: "",
  ...actions,
};

describe("AudioControls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    document.body.appendChild(target);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shows Voice only while the text input is empty", async () => {
    const { rerender } = render(<AudioControls {...props} />);
    fireEvent.click(await screen.findByRole("button", { name: "Voice" }));
    expect(actions.onStartVoice).toHaveBeenCalledTimes(1);

    rerender(<AudioControls {...props} hasText />);
    expect(screen.queryByRole("button", { name: "Voice" })).toBeNull();
  });

  it("shows the one-row audio actions", () => {
    render(
      <AudioControls
        {...props}
        channel={Channel.Audio}
        isConnected
        devices={[
          { deviceId: "mic-1", label: "Built-in" },
          { deviceId: "mic-2", label: "USB Microphone" },
        ] as MediaDeviceInfo[]}
        activeDeviceId="mic-1"
      />,
    );
    expect(screen.getByTestId("message-input-controls")).toHaveClass("rapida-audio");
    fireEvent.click(screen.getByRole("button", { name: "Text" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop" }));
    fireEvent.click(screen.getByRole("button", { name: "USB Microphone" }));
    expect(actions.onSwitchToText).toHaveBeenCalledTimes(1);
    expect(actions.onStop).toHaveBeenCalledTimes(1);
    expect(actions.onDeviceChange).toHaveBeenCalledWith("mic-2");
  });
});
