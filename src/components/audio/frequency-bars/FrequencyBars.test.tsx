import { render } from "@testing-library/react";
import { FrequencyBars } from "./FrequencyBars";

describe("FrequencyBars", () => {
  it("renders one level for every frequency band", () => {
    const { container } = render(
      <FrequencyBars frequencies={[[0.1], [0.5], [0.9]]} isMuted={false} />,
    );
    expect(container.querySelectorAll(".rapida-audio__frequency-bar")).toHaveLength(3);
  });
});
