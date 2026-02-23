"use client";

/**
 * Authentication context providing user state and auth operations.
 * Connected to the FastAPI backend via apiClient.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LoginCredentials, RegisterCredentials, User } from "./types";
import { apiClient } from "./api";
import { getMockUser } from "./mock";


interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Hook to access auth context. Throws if used outside AuthProvider. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // On mount, check if there's a stored token and fetch user profile
  useEffect(() => {
    // TEMP: mock auth for Figma export
    setState({
      user: getMockUser(),
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const tokens = await apiClient.login(credentials);
      apiClient.setTokens(tokens);

      const user = await apiClient.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const tokens = await apiClient.register(credentials);
      apiClient.setTokens(tokens);

      const user = await apiClient.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch (err) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    apiClient.clearTokens();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout, updateUser }),
    [state, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
