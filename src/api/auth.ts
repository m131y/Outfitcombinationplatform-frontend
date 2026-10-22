import { MOCK_ALL, request } from "./client";
import { mock } from "./mock";
import type { AuthResponse, LoginInput, SignupInput, User } from "./types";

/** POST /api/auth/login — 이메일이면 email, 아니면 username 으로 보냅니다. */
export function login({ loginId, password }: LoginInput) {
  if (MOCK_ALL) return mock.login();
  const id = loginId.trim();
  const body = id.includes("@") ? { email: id, password } : { username: id, password };
  return request<AuthResponse>("/api/auth/login", { method: "POST", body, auth: false });
}

/** POST /api/auth/signup — User.nickname 이 NOT NULL 이라 비어 있으면 아이디로 채웁니다. */
export function signup(input: SignupInput) {
  if (MOCK_ALL) return mock.login();
  const body = { ...input, nickname: input.nickname?.trim() || input.username };
  return request<AuthResponse>("/api/auth/signup", { method: "POST", body, auth: false });
}

/** GET /api/user/me */
export function fetchMe() {
  if (MOCK_ALL) return mock.fetchMe();
  return request<User>("/api/user/me");
}
