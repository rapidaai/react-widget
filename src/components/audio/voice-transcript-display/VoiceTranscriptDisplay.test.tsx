import { render, screen } from "@testing-library/react";
import { VoiceTranscriptDisplay } from "./VoiceTranscriptDisplay";

describe("VoiceTranscriptDisplay", () => {
  it("prefers transcript text over connection status", () => {
    const { rerender } = render(
      <VoiceTranscriptDisplay transcript="Hello" isConnecting />,
    );
    expect(screen.getByText("Hello")).toBeVisible();

    rerender(<VoiceTranscriptDisplay isConnecting={false} />);
    expect(screen.getByText("Listening…")).toBeVisible();
  });
});
