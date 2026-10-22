import { MOCK_ALL, request, withMockFallback } from "./client";
import { mock } from "./mock";
import type { FeedQuery, PageResult, Picture, UpdatePictureInput, UploadPictureInput } from "./types";

/** Spring Page / Slice / 제안한 PageResponse 어떤 모양이 와도 받도록 맞춥니다. */
function normalizePage(raw: unknown, page: number, size: number): PageResult<Picture> {
  if (Array.isArray(raw)) return { content: raw as Picture[], page, size, hasNext: false };
  const r = (raw ?? {}) as Record<string, unknown>;
  const content = (r.content as Picture[]) ?? [];
  const hasNext =
    typeof r.hasNext === "boolean" ? r.hasNext : typeof r.last === "boolean" ? !r.last : content.length === size;
  const p = typeof r.page === "number" ? r.page : typeof r.number === "number" ? r.number : page;
  return { content, page: p, size, hasNext };
}

/** 제안: GET /api/pictures?type=&tag=&userId=&page=&size= */
export function fetchFeed(q: FeedQuery): Promise<PageResult<Picture>> {
  const page = q.page ?? 0;
  const size = q.size ?? 20;
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.type) params.set("type", q.type);
  if (q.tag) params.set("tag", q.tag.replace(/^#/, ""));
  if (q.userId) params.set("userId", String(q.userId));
  return withMockFallback(
    "GET /api/pictures",
    async () => normalizePage(await request<unknown>(`/api/pictures?${params}`), page, size),
    () => mock.feed({ ...q, page, size }),
  );
}

/** 제안: GET /api/pictures/{id} */
export function fetchPicture(id: number) {
  return withMockFallback("GET /api/pictures/{id}", () => request<Picture>(`/api/pictures/${id}`), () => mock.picture(id));
}

/** 제안: POST /api/pictures/{id}/like  (LikeService.toggleLike 는 이미 있어요) */
export function toggleLike(id: number) {
  return withMockFallback(
    "POST /api/pictures/{id}/like",
    () => request<{ liked: boolean; likesCount: number }>(`/api/pictures/${id}/like`, { method: "POST" }),
    () => mock.toggleLike(id),
  );
}

/**
 * POST /api/pictures (multipart)
 * - data: UploadPictureDto JSON (Content-Type: application/json 파트로 보내야 @RequestPart 가 읽어요)
 * - image: 파일
 */
export function uploadPicture(input: UploadPictureInput) {
  if (MOCK_ALL) return mock.upload(input);
  const data = {
    description: input.description,
    pictureType: input.pictureType,
    styleTags: input.styleTags,
    clothingItem:
      input.pictureType === "ITEM" && input.clothingItem
        ? { ...input.clothingItem, styleTags: input.styleTags, categories: [] }
        : null,
  };
  const form = new FormData();
  form.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  form.append("image", input.file);
  return request<Picture>("/api/pictures", { method: "POST", form });
}

/** PUT /api/pictures/{id} — 백엔드에 @RequestBody 추가가 필요해요 (BACKEND_NOTES.md). */
export function updatePicture(id: number, input: UpdatePictureInput) {
  if (MOCK_ALL) return mock.update(id, input);
  return request<Picture>(`/api/pictures/${id}`, { method: "PUT", body: input });
}

/** DELETE /api/pictures/{id} */
export function deletePicture(id: number) {
  if (MOCK_ALL) return mock.remove(id);
  return request<void>(`/api/pictures/${id}`, { method: "DELETE" });
}
