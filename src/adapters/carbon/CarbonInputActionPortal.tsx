import { FC, ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SEND_ACTION_SELECTOR =
  ".cds-aichat--input-container__send-button-container";
const CHAT_SCOPE_SELECTOR =
  "cds-aichat-react, cds-aichat-custom-element, .cds-aichat--container--render";

function getCarbonSearchRoots(anchor: HTMLElement): ParentNode[] {
  const roots = new Set<ParentNode>([anchor.ownerDocument]);
  const anchorRoot = anchor.getRootNode();
  if (anchorRoot instanceof Document || anchorRoot instanceof ShadowRoot) {
    roots.add(anchorRoot);
  }
  let element: HTMLElement | null = anchor;

  while (element) {
    const slotRoot = element.assignedSlot?.getRootNode();
    if (slotRoot instanceof Document || slotRoot instanceof ShadowRoot) {
      roots.add(slotRoot);
    }
    if (element.shadowRoot) roots.add(element.shadowRoot);
    element = element.parentElement;
  }

  return [...roots];
}

export function findCarbonInputActionTarget(
  anchor: HTMLElement | null,
): HTMLElement | null {
  if (!anchor) return null;

  const chatScope = anchor.closest<HTMLElement>(CHAT_SCOPE_SELECTOR);
  const scopedTarget =
    chatScope?.shadowRoot?.querySelector<HTMLElement>(SEND_ACTION_SELECTOR) ??
    chatScope?.querySelector<HTMLElement>(SEND_ACTION_SELECTOR);
  if (scopedTarget) return scopedTarget;

  for (const root of getCarbonSearchRoots(anchor)) {
    if (root instanceof Document) continue;
    const target = root.querySelector<HTMLElement>(SEND_ACTION_SELECTOR);
    if (target) return target;
  }

  const documentTargets = anchor.ownerDocument.querySelectorAll<HTMLElement>(
    SEND_ACTION_SELECTOR,
  );
  return documentTargets.length === 1 ? documentTargets[0] : null;
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
    const anchor = anchorRef.current;
    if (!anchor) return;

    const observers = new Map<ParentNode, MutationObserver>();
    const observeRoot = (root: ParentNode) => {
      if (observers.has(root)) return;
      const observer = new MutationObserver(syncTarget);
      observer.observe(root, { childList: true, subtree: true });
      observers.set(root, observer);
    };
    const syncTarget = () => {
      getCarbonSearchRoots(anchor).forEach(observeRoot);
      const nextTarget = findCarbonInputActionTarget(anchorRef.current);
      setTarget((current) => (current === nextTarget ? current : nextTarget));
    };

    syncTarget();
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <>
      <span ref={anchorRef} hidden />
      {target && createPortal(children, target)}
    </>
  );
};
