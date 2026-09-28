import { MessageRole, MessageStatus } from "@rapidaai/react";
import { MessageInputType } from "@carbon/ai-chat";
import {
  createTranscriptRequest,
  createWelcomeMessage,
  getMessageText,
  planAssistantSync,
} from "./message-sync";

describe("message sync", () => {
  it("creates a Carbon transcript request", () => {
    const request = createTranscriptRequest("hello", "voice-1");
    expect(request.input).toEqual({ message_type: MessageInputType.TEXT, text: "hello" });
    expect(request.id).toBe("voice-1");
  });

  it("creates a welcome response only when content exists", () => {
    expect(createWelcomeMessage()).toBeNull();
    expect(createWelcomeMessage("Hello", ["Help"])).toMatchObject({
      id: "rapida-welcome",
      output: { generic: [{ text: "Hello" }, { options: [{ label: "Help" }] }] },
    });
  });

  it("plans incremental and final assistant chunks", () => {
    const partialMessage = {
      id: "1",
      role: MessageRole.System,
      status: MessageStatus.Pending,
      messages: ["working"],
    } as any;
    const partial = planAssistantSync(partialMessage);
    const final = planAssistantSync({
      ...partialMessage,
      status: MessageStatus.Complete,
      messages: ["done"],
    });

    expect(partial.kind === "chunk" && partial.chunk).toHaveProperty("partial_item");
    expect(final.kind === "chunk" && final.chunk).toHaveProperty("final_response");
  });

  it("does not render an unchanged assistant message twice", () => {
    const message = {
      id: "1",
      role: MessageRole.System,
      status: MessageStatus.Complete,
      messages: ["done"],
    } as any;
    expect(getMessageText(message)).toBe("done");
    expect(
      planAssistantSync(message, {
        carbonId: "rapida:system:1",
        itemId: "system:1:text",
        text: "done",
        status: MessageStatus.Complete,
      }),
    ).toEqual({ kind: "none" });
  });
});
