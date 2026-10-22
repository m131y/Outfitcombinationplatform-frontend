import type { PictureType } from "../api/types";

export const APP_NAME = "outfit";

export const TYPE_LABEL: Record<PictureType, string> = {
  OOTD: "OOTD",
  STYLE: "스타일",
  ITEM: "아이템",
};

export const TYPE_HINT: Record<PictureType, string> = {
  OOTD: "오늘 입은 옷",
  STYLE: "참고하고 싶은 조합",
  ITEM: "옷 하나를 소개",
};

export const POPULAR_TAGS = ["미니멀", "스트릿", "캐주얼", "빈티지", "오피스룩", "아메카지", "고프코어", "러블리", "데님", "모노톤"];

export function displayName(u?: { nickname: string | null } | null) {
  return u?.nickname?.trim() || "이름 없음";
}

export function normalizeTag(raw: string) {
  return raw.trim().replace(/^#+/, "").replace(/\s+/g, "");
}
