const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
export const MOCK_ALL = import.meta.env.VITE_USE_MOCK === "true";

export class ApiError extends Error {
  constructor(public status: number, message: string, public fromApiResponse = false) {
    super(message);
  }
  /**
   * 백엔드에 아직 해당 API가 없을 때.
   * 405 이거나, ApiResponse 형식이 아닌 Spring 기본 404 (매핑된 URL 자체가 없음) 인 경우.
   * ApiResponse 로 온 404 는 "데이터가 없음" 이라 예시 데이터로 바꾸지 않습니다.
   */
  get notImplemented() {
    return this.status === 405 || (this.status === 404 && !this.fromApiResponse);
  }
}

const TOKEN_KEY = "outfit.accessToken";

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* 저장 불가 환경 */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* 저장 불가 환경 */
    }
  },
};

let unauthorizedHandler: (() => void) | null = null;
export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

function defaultMessage(status: number) {
  if (status === 400) return "입력한 내용을 다시 확인해 주세요.";
  if (status === 401 || status === 403) return "로그인이 필요해요. 다시 로그인해 주세요.";
  if (status === 404) return "찾는 내용이 없어요.";
  if (status === 413) return "사진 용량이 너무 커요. 더 작은 사진을 골라 주세요.";
  if (status >= 500) return "서버에서 문제가 생겼어요. 잠시 후 다시 시도해 주세요.";
  return "요청을 처리하지 못했어요.";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  form?: FormData;
  auth?: boolean;
}

/**
 * fetch 래퍼.
 * - JWT를 Authorization 헤더에 붙입니다.
 * - 응답이 ApiResponse { success, message, data } 형태면 data만 꺼내고,
 *   DTO를 그대로 주는 API(auth, user 등)는 그대로 돌려줍니다.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, form, auth = true } = options;
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (form) {
    payload = form; // Content-Type은 브라우저가 boundary와 함께 붙입니다.
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(BASE_URL + path, { method, headers, body: payload });
  } catch {
    throw new ApiError(0, "서버에 연결할 수 없어요. 백엔드가 켜져 있는지 확인해 주세요.");
  }

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && token) unauthorizedHandler?.();
    const msg =
      json && typeof json === "object" && "message" in json && typeof json.message === "string" && json.message
        ? json.message
        : defaultMessage(res.status);
    const isApiResponse = !!json && typeof json === "object" && "success" in json;
    throw new ApiError(res.status, msg, isApiResponse);
  }

  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

const warned = new Set<string>();

/**
 * 아직 백엔드에 없는 API용.
 * 실제 API를 먼저 호출하고, 404/405면 예시 데이터로 대체합니다.
 * 백엔드에 API가 추가되면 프론트 수정 없이 실제 데이터로 바뀝니다.
 */
export async function withMockFallback<T>(label: string, real: () => Promise<T>, mock: () => Promise<T>): Promise<T> {
  if (MOCK_ALL) return mock();
  try {
    return await real();
  } catch (e) {
    if (e instanceof ApiError && e.notImplemented) {
      if (!warned.has(label)) {
        warned.add(label);
        console.warn(`[outfit] ${label} API가 아직 없어 예시 데이터를 사용합니다. BACKEND_NOTES.md 참고.`);
      }
      return mock();
    }
    throw e;
  }
}
