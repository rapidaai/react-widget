import { Channel, MessageRole, MessageStatus } from "@rapidaai/react";
import { getActiveVoiceTranscript } from "./voice-transcript";

describe("getActiveVoiceTranscript", () => {
  const messages = [
    { id: "1", role: MessageRole.User, status: MessageStatus.Complete, messages: ["older"] },
    { id: "2", role: MessageRole.System, status: MessageStatus.Pending, messages: ["reply"] },
    { id: "3", role: MessageRole.User, status: MessageStatus.Pending, messages: ["latest"] },
  ] as any;

  it("returns the newest in-progress user transcript", () => {
    expect(getActiveVoiceTranscript(messages, Channel.Audio)).toBe("latest");
  });

  it("returns no transcript outside voice mode", () => {
    expect(getActiveVoiceTranscript(messages, Channel.Text)).toBe("");
  });

  it("ignores pending transcripts retained from an earlier voice session", () => {
    expect(
      getActiveVoiceTranscript(messages, Channel.Audio, new Set(["3"])),
    ).toBe("");
  });
});
