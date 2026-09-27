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
});
