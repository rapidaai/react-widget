import { FC, ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SEND_ACTION_SELECTOR =
  ".cds-aichat--input-container__send-button-container";

export function findCarbonInputActionTarget(
  anchor: HTMLElement | null,
): HTMLElement | null {
  if (!anchor) return null;

  const roots: ParentNode[] = [];
  let element: HTMLElement | null = anchor;

  while (element) {
    const slotRoot = element.assignedSlot?.getRootNode();
    if (slotRoot instanceof Document || slotRoot instanceof ShadowRoot) {
      roots.push(slotRoot);
    }
    if (element.shadowRoot) roots.push(element.shadowRoot);
    element = element.parentElement;
  }

  anchor.ownerDocument
    .querySelectorAll<HTMLElement>("cds-aichat-react, cds-aichat-custom-element")
    .forEach((host) => {
      if (host.shadowRoot) roots.push(host.shadowRoot);
    });
  roots.push(anchor.ownerDocument);

  for (const root of roots) {
    const target = root.querySelector<HTMLElement>(SEND_ACTION_SELECTOR);
    if (target) return target;
  }

  return null;
}

/**
 * Carbon AI Chat has no supported input-action slot. This adapter contains the
 * only shadow-DOM lookup required to place Voice beside Carbon's Send button.
 */
export const CarbonInputActionPortal: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const findTarget = () => {
      const nextTarget = findCarbonInputActionTarget(anchorRef.current);
      setTarget((current) => (current === nextTarget ? current : nextTarget));
    };

    findTarget();
    const intervalId = window.setInterval(findTarget, 100);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <span ref={anchorRef} hidden />
      {target && createPortal(children, target)}
    </>
  );
};
