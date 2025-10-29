import { createContext, useState, type ReactNode } from "react";

export type AuthContextType = {
  navOpen: () => void;
  setNavOpen: (state: boolean) => void;
  isNavOpen: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const navOpen = () => setIsNavOpen((prev) => !prev);
  const setNavOpen = (state: boolean) => setIsNavOpen(state);

  return (
    <AuthContext.Provider
      value={{
        navOpen,
        setNavOpen,
        isNavOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
