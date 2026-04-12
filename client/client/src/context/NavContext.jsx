import { createContext, useState, useCallback, useMemo } from "react";
import { ROUTES } from "../constants";

export const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [route, setRoute] = useState({
    page: ROUTES.HOME,
    param: null,
  });

  const navigate = useCallback((page, param = null) => {
    setRoute({ page, param });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const value = useMemo(
    () => ({ ...route, navigate }),
    [route, navigate]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}