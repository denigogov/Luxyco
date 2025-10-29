import { useContext } from "react";
import { UIContext, type UIContextType } from "../state/UIContext";

export const useUIState = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIState must be used within a UIProvider");
  }
  return context;
};
