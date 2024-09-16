import { EnvironmentContext } from "@/contexts/environment-context";
import { useContext } from "react";

export const useEnvironment = () => {
  return useContext(EnvironmentContext);
};
