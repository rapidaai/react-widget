import { act, renderHook } from "@testing-library/react";
import { useCarbonInputHasText } from "./useCarbonInputHasText";

describe("useCarbonInputHasText", () => {
  it("tracks Carbon input state changes", () => {
    let handler: any;
    const instance = {
      getState: () => ({ input: { rawValue: "" } }),
      on: jest.fn((value) => {
        handler = value;
      }),
      off: jest.fn(),
    } as any;
    const { result, unmount } = renderHook(() => useCarbonInputHasText(instance));

    expect(result.current).toBe(false);
    act(() => handler.handler({ newState: { input: { rawValue: "hello" } } }));
    expect(result.current).toBe(true);
    unmount();
    expect(instance.off).toHaveBeenCalledWith(handler);
  });
});
