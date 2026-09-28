import { useEffect, useState } from "react";
import {
  BusEventStateChange,
  BusEventType,
  ChatInstance,
  TypeAndHandler,
} from "@carbon/ai-chat";

export function useCarbonInputHasText(chatInstance?: ChatInstance | null): boolean {
  const [hasText, setHasText] = useState(() =>
    Boolean(chatInstance?.getState().input.rawValue.trim()),
  );

  useEffect(() => {
    if (!chatInstance) {
      setHasText(false);
      return;
    }

    setHasText(Boolean(chatInstance.getState().input.rawValue.trim()));
    const stateChangeHandler: TypeAndHandler = {
      type: BusEventType.STATE_CHANGE,
      handler: (event) => {
        const stateChange = event as BusEventStateChange;
        setHasText(Boolean(stateChange.newState.input.rawValue.trim()));
      },
    };
    chatInstance.on(stateChangeHandler);

    return () => {
      chatInstance.off(stateChangeHandler);
    };
  }, [chatInstance]);

  return hasText;
}
