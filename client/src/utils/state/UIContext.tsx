import { createContext, useState, type ReactNode } from "react";
import {
  getLocalStorageGroup,
  setLocalStorageGroup,
} from "../../whitelabel/src/global/utils/storage/localStorage";

export type UIContextType = {
  isNavOpen: boolean;
  toggleNav: () => void;
  setNav: (state: boolean) => void;

  isMobileQuickMenuVisible: boolean;
  toggleMobileQuickMenu: () => void;
  setMobileQuickMenuVisible: (state: boolean) => void;
};

export const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const [isMobileQuickMenuVisible, setIsMobileQuickMenuVisible] =
    useState<boolean>(() => {
      const preferences = getLocalStorageGroup("userPreference");

      return preferences?.mobileQuickMenuVisible ?? true;
    });

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  const setNav = (state: boolean) => {
    setIsNavOpen(state);
  };

  const saveMobileQuickMenuPreference = (state: boolean) => {
    const currentPreferences = getLocalStorageGroup("userPreference") ?? {};

    setLocalStorageGroup("userPreference", {
      ...currentPreferences,
      mobileQuickMenuVisible: state,
    });
  };

  const setMobileQuickMenuVisible = (state: boolean) => {
    setIsMobileQuickMenuVisible(state);
    saveMobileQuickMenuPreference(state);
  };

  const toggleMobileQuickMenu = () => {
    setIsMobileQuickMenuVisible((currentState) => {
      const nextState = !currentState;

      saveMobileQuickMenuPreference(nextState);

      return nextState;
    });
  };

  return (
    <UIContext.Provider
      value={{
        isNavOpen,
        toggleNav,
        setNav,

        isMobileQuickMenuVisible,
        toggleMobileQuickMenu,
        setMobileQuickMenuVisible,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
