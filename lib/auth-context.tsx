"use client";

/**
 * Authentication context providing user state and auth operations.
 * Wraps the application with auth state management.
 * Replace mock logic with real API calls when backend is ready.
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
import { getMockUser, simulateDelay } from "./mock";

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

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    if (token) {
      // TODO: Replace with apiClient.getProfile() when backend is ready
      setState({
        user: getMockUser(),
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (_credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with apiClient.login(credentials) when backend is ready
      await simulateDelay(800);
      const user = getMockUser();
      document.cookie = "auth_token=mock_jwt_token; path=/; max-age=86400; SameSite=Strict";
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Invalid credentials");
    }
  }, []);

  const register = useCallback(async (_credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with apiClient.register(credentials) when backend is ready
      await simulateDelay(800);
      const user = getMockUser();
      document.cookie = "auth_token=mock_jwt_token; path=/; max-age=86400; SameSite=Strict";
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Registration failed");
    }
  }, []);

  const logout = useCallback(async () => {
    // TODO: Replace with apiClient.logout() when backend is ready
    document.cookie = "auth_token=; path=/; max-age=0";
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
