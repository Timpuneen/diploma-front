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
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";

function readCookieValue(key: string): string | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${key}=`));
  if (!row) return null;
  const raw = row.slice(key.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: (payload: { code: string; redirectUri: string }) => Promise<void>;
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

  // On mount: if access or refresh cookie exists, load profile.
  // When access cookie expired (browser removed it) but refresh remains, refresh tokens first — avoids 403 "Not authenticated" from FastAPI HTTPBearer.
  useEffect(() => {
    const access = readCookieValue(AUTH_TOKEN_KEY);
    const refresh = readCookieValue(REFRESH_TOKEN_KEY);
    if (!access && !refresh) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    let cancelled = false;
    void (async () => {
      if (!access && refresh) {
        await apiClient.refreshTokens();
      }
      if (cancelled) return;
      try {
        const user = await apiClient.getMe();
        if (!cancelled) {
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } catch {
        if (!cancelled) {
          apiClient.clearTokens();
          setState({ user: null, isLoading: false, isAuthenticated: false });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
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

  const loginWithGoogle = useCallback(
    async (payload: { code: string; redirectUri: string }) => {
      const tokens = await apiClient.loginWithGoogle({
        code: payload.code,
        redirect_uri: payload.redirectUri,
      });
      apiClient.setTokens(tokens);
      const user = await apiClient.getMe();
      setState({ user, isLoading: false, isAuthenticated: true });
    },
    []
  );

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
    const access = readCookieValue(AUTH_TOKEN_KEY);
    const refresh = readCookieValue(REFRESH_TOKEN_KEY);
    if (!access && !refresh) return;
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
    () => ({
      ...state,
      login,
      register,
      loginWithGoogle,
      logout,
      updateUser,
      refreshUser,
    }),
    [state, login, register, loginWithGoogle, logout, updateUser, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
