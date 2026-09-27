import { DeviceSelector } from "./DeviceSelector";

export default {
  title: "Audio/DeviceSelector",
  component: DeviceSelector,
};

export const Default = {
  args: {
    devices: [
      { deviceId: "built-in", label: "Built-in Microphone" },
      { deviceId: "usb", label: "USB Microphone" },
    ] as MediaDeviceInfo[],
    activeDeviceId: "built-in",
    onDeviceChange: () => undefined,
  },
};
