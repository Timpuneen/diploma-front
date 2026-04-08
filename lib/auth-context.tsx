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
import { AUTH_TOKEN_KEY } from "./constants";

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
  refreshUser: () => Promise<void>;
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
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (token) {
      apiClient
        .getMe()
        .then((user) => {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          apiClient.clearTokens();
          setState({ user: null, isLoading: false, isAuthenticated: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const tokens = await apiClient.login(credentials);
      apiClient.setTokens(tokens);
      const user = await apiClient.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch (err) {
      throw err;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      const tokens = await apiClient.register(credentials);
      apiClient.setTokens(tokens);
      const user = await apiClient.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch (err) {
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

  const refreshUser = useCallback(async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`))
      ?.split("=")[1];
    if (!token) return;
    try {
      const user = await apiClient.getMe();
      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    } catch {
      apiClient.clearTokens();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout, updateUser, refreshUser }),
    [state, login, register, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
