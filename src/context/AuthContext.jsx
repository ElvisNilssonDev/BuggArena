import { createContext, useReducer, useCallback, useMemo, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: true };
    case AUTH_ACTIONS.LOGIN:
      return { user: action.payload, isAuthenticated: true, loading: false };
    case AUTH_ACTIONS.LOGOUT:
      return { user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return;
    }
    authService
      .getMe()
      .then((user) => dispatch({ type: AUTH_ACTIONS.LOGIN, payload: user }))
      .catch(() => {
        localStorage.removeItem("token");
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      });
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: data });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid email or password.",
      };
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const data = await authService.register(username, email, password);
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: data });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}