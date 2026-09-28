import { render, screen, waitFor } from "@testing-library/react";
import {
  CarbonInputActionPortal,
  findCarbonInputActionTarget,
} from "./CarbonInputActionPortal";

describe("CarbonInputActionPortal", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("finds Carbon's input action target", () => {
    const anchor = document.createElement("span");
    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    document.body.append(anchor, target);
    expect(findCarbonInputActionTarget(anchor)).toBe(target);
  });

  it("finds a target inside Carbon's shadow root", () => {
    const host = document.createElement("cds-aichat-react");
    const root = host.attachShadow({ mode: "open" });
    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    root.appendChild(target);
    const anchor = document.createElement("span");
    host.appendChild(anchor);
    document.body.append(host);

    expect(findCarbonInputActionTarget(anchor)).toBe(target);
  });

  it("searches the shadow root containing the anchor", () => {
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    const anchor = document.createElement("span");
    root.append(target, anchor);
    document.body.appendChild(host);

    expect(findCarbonInputActionTarget(anchor)).toBe(target);
  });

  it("keeps each portal scoped to its own Carbon widget", () => {
    const createWidget = () => {
      const host = document.createElement("cds-aichat-react");
      const root = host.attachShadow({ mode: "open" });
      const target = document.createElement("div");
      target.className = "cds-aichat--input-container__send-button-container";
      const anchor = document.createElement("span");
      root.appendChild(target);
      host.appendChild(anchor);
      document.body.appendChild(host);
      return { anchor, target };
    };
    const first = createWidget();
    const second = createWidget();

    expect(findCarbonInputActionTarget(first.anchor)).toBe(first.target);
    expect(findCarbonInputActionTarget(second.anchor)).toBe(second.target);
  });

  it("searches the shadow root assigned to a slotted anchor", () => {
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    root.append(slot, target);
    const anchor = document.createElement("span");
    host.appendChild(anchor);
    document.body.appendChild(host);

    expect(anchor.assignedSlot).toBe(slot);
    expect(findCarbonInputActionTarget(anchor)).toBe(target);
  });

  it("waits for a target created after mount", async () => {
    render(
      <CarbonInputActionPortal>
        <button>Voice</button>
      </CarbonInputActionPortal>,
    );
    expect(screen.queryByRole("button", { name: "Voice" })).toBeNull();

    const target = document.createElement("div");
    target.className = "cds-aichat--input-container__send-button-container";
    document.body.appendChild(target);
    expect(await screen.findByRole("button", { name: "Voice" })).toBeVisible();
  });

  it("disconnects its observers when unmounted", () => {
    const disconnect = jest.spyOn(MutationObserver.prototype, "disconnect");
    const { unmount } = render(
      <CarbonInputActionPortal>
        <button>Voice</button>
      </CarbonInputActionPortal>,
    );

    unmount();

    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});
