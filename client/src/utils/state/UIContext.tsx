import { createContext, useState, type ReactNode } from "react";

export type UIContextType = {
  isNavOpen: boolean;
  toggleNav: () => void;
  setNav: (state: boolean) => void;
};

export const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const setNav = (state: boolean) => setIsNavOpen(state);

  return (
    <UIContext.Provider value={{ isNavOpen, toggleNav, setNav }}>
      {children}
    </UIContext.Provider>
  );
};
