import {
  getCustomElementShellStyle,
  getThemeLayoutProperties,
  resolveLayoutSettings,
} from "./layout";

describe("layout", () => {
  it("resolves the floating defaults", () => {
    expect(resolveLayoutSettings()).toEqual({
      mode: "floating",
      position: "bottom-right",
    });
  });

  it("keeps Carbon layout options separate from widget placement", () => {
    expect(
      resolveLayoutSettings({
        mode: "docked-left",
        position: "top-left",
        showFrame: false,
      }),
    ).toEqual({
      mode: "docked-left",
      position: "top-left",
      aiChatLayout: { showFrame: false },
    });
  });

  it("only emits position tokens for floating mode", () => {
    expect(getThemeLayoutProperties("inline", "bottom-right")).toBeUndefined();
    expect(getThemeLayoutProperties("floating", "top-left")).toMatchObject({
      top_position: "1rem",
      left_position: "1rem",
      bottom_position: "auto",
      right_position: "auto",
    });
  });

  it("keeps inline rendering in normal document flow", () => {
    expect(getCustomElementShellStyle("inline", "right", true)).toEqual({
      width: "100%",
      height: "100%",
      minHeight: "560px",
    });
  });
});
