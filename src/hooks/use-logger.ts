import { useEnvironment } from "@/hooks/use-environment";
import React from "react";

export const useLogger = () => {
  const { debug, assistantId } = useEnvironment();

  return (message: any) => {
    if (debug) {
      console.log(`[${assistantId || "NoID"}] ${message}`);
    }
  };
};

export const useDebugger = () => {
  const { debug, assistantId } = useEnvironment();

  return {
    log: (message: any) => {
      if (debug) {
        console.log(message);
      }
    },
    dir: (message: any) => {
      if (debug) {
        console.dir(message);
      }
    },
  };
};
