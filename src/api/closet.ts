import { ApiError, MOCK_ALL, request, withMockFallback } from "./client";
import { mock } from "./mock";
import type { ClosetEntry } from "./types";

/** 제안: GET /api/closet/me */
export function fetchMyCloset() {
  return withMockFallback("GET /api/closet/me", () => request<ClosetEntry[]>("/api/closet/me"), () => mock.closet());
}

/** POST /api/closet — 옷장이 이미 있으면(400) 그냥 넘어갑니다. */
export async function ensureCloset() {
  if (MOCK_ALL) return;
  try {
    await request<void>("/api/closet", { method: "POST" });
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 400)) throw e;
  }
}

/** POST /api/closet/item/add/{clothingItemId} */
export async function addToCloset(clothingItemId: number) {
  if (MOCK_ALL) return mock.addToCloset(clothingItemId);
  await ensureCloset();
  return request<void>(`/api/closet/item/add/${clothingItemId}`, { method: "POST" });
}

/** DELETE /api/closet/item/delete/{closetItemId} */
export function removeFromCloset(closetItemId: number) {
  if (MOCK_ALL) return mock.removeFromCloset(closetItemId);
  return request<void>(`/api/closet/item/delete/${closetItemId}`, { method: "DELETE" });
}
