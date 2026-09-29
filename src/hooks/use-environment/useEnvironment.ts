import { useContext } from "react";
import { EnvironmentContext } from "@/contexts";

export const useEnvironment = () => useContext(EnvironmentContext);
