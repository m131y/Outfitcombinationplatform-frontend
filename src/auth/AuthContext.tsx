import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchMe, login as apiLogin, signup as apiSignup } from "../api/auth";
import { ensureCloset } from "../api/closet";
import { onUnauthorized, tokenStore } from "../api/client";
import type { LoginInput, SignupInput, User, UserSummary } from "../api/types";

type AuthUser = UserSummary & Partial<Pick<User, "email" | "authProvider" | "createdAt">>;

interface AuthState {
  user: AuthUser | null;
  ready: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);
const USER_KEY = "outfit.user";

function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function cacheUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* 저장 불가 환경 */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (tokenStore.get() ? readCachedUser() : null));
  const [ready, setReady] = useState(!tokenStore.get());

  const setAndCache = useCallback((u: AuthUser | null) => {
    setUser(u);
    cacheUser(u);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setAndCache(null);
  }, [setAndCache]);

  useEffect(() => {
    onUnauthorized(logout);
    if (!tokenStore.get()) return;
    fetchMe()
      .then((me) => setAndCache(me))
      .catch(() => logout())
      .finally(() => setReady(true));
  }, [logout, setAndCache]);

  const login = useCallback(
    async (input: LoginInput) => {
      const res = await apiLogin(input);
      tokenStore.set(res.access_token);
      setAndCache(res.user);
      fetchMe().then(setAndCache).catch(() => undefined);
    },
    [setAndCache],
  );

  const signup = useCallback(
    async (input: SignupInput) => {
      const res = await apiSignup(input);
      tokenStore.set(res.access_token);
      setAndCache(res.user);
      // 옷장은 1인 1개 — 가입 직후 만들어 둡니다.
      ensureCloset().catch(() => undefined);
    },
    [setAndCache],
  );

  const value = useMemo(() => ({ user, ready, login, signup, logout }), [user, ready, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider 안에서 사용해야 해요.");
  return ctx;
}
