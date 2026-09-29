import { FC, useMemo } from "react";

export interface FrequencyBarsProps {
  frequencies: ReadonlyArray<ArrayLike<number>>;
  isMuted: boolean;
}

export const FrequencyBars: FC<FrequencyBarsProps> = ({
  frequencies,
  isMuted,
}) => {
  const levels = useMemo(
    () =>
      frequencies.map((band) => {
        if (!band?.length) return 0;
        const values = Array.from(band);
        const rms = Math.sqrt(
          values.reduce((sum, value) => sum + value * value, 0) / values.length,
        );
        return Math.min(1, Math.pow(rms, 0.7) * 1.2);
      }),
    [frequencies],
  );

  return (
    <div className="rapida-audio__frequency-bars" aria-hidden="true">
      {levels.map((level, index) => (
        <span
          key={`frequency-${index}`}
          className="rapida-audio__frequency-bar"
          style={{
            height: 3 + Math.max(level, 0.05) * 15,
            transform: `scaleY(${!isMuted && level > 0.3 ? 1 + level * 0.1 : 1})`,
            backgroundColor: isMuted
              ? "var(--cds-support-error)"
              : "var(--cds-icon-interactive)",
          }}
        />
      ))}
    </div>
  );
};
