import { FC } from "react";
import { OverflowMenu, OverflowMenuItem } from "@carbon/react";
import { Checkmark, SettingsAdjust } from "@carbon/icons-react";

export interface DeviceSelectorProps {
  devices: MediaDeviceInfo[];
  activeDeviceId: string;
  onDeviceChange: (id: string) => void;
}

export const DeviceSelector: FC<DeviceSelectorProps> = ({
  devices,
  activeDeviceId,
  onDeviceChange,
}) => (
  <div className="rapida-audio__device-selector">
    <OverflowMenu
      id="rapida-microphone-selector"
      aria-label="Select Microphone"
      iconDescription="Select microphone"
      align="top"
      renderIcon={SettingsAdjust}
      direction="top"
      flipped
      size="sm"
      menuOptionsClass="rapida-microphone-menu-options"
      style={{ color: "var(--cds-icon-secondary)" }}
    >
      {devices.map((device, index) => {
        const label = device.label || `Microphone ${index + 1}`;
        const isActive = device.deviceId === activeDeviceId;
        return (
          <OverflowMenuItem
            key={device.deviceId || index}
            title={label}
            itemText={
              <span className="rapida-audio__device-item">
                <span className="rapida-audio__device-label">{label}</span>
                {isActive && <Checkmark aria-label="Selected" />}
              </span>
            }
            onClick={() => onDeviceChange(device.deviceId)}
          />
        );
      })}
    </OverflowMenu>
  </div>
);
