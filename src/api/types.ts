// 백엔드 DTO와 맞춘 타입입니다.
// "제안"이라고 적힌 부분은 아직 백엔드에 없고, BACKEND_NOTES.md 에 추가 방법을 적어두었습니다.

export type PictureType = "OOTD" | "STYLE" | "ITEM";
export type AuthProvider = "LOCAL" | "GOOGLE" | "KAKAO" | "NAVER";
export type ClosetItemSource = "UPLOADED" | "FROM_POST";

/** UserSummaryDto */
export interface UserSummary {
  id: number;
  nickname: string | null;
  profileImageUrl: string | null;
}

/** UserDto (GET /api/user/me) */
export interface User extends UserSummary {
  email: string;
  authProvider: AuthProvider;
  createdAt: string;
}

/** AuthResponseDto */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  tokenType: string;
  user: UserSummary;
}

export interface SignupInput {
  email: string;
  username: string;
  password: string;
  nickname?: string;
}

export interface LoginInput {
  loginId: string; // 이메일 또는 아이디
  password: string;
}

/** ClothingItemDto (업로드용) */
export interface ClothingItemInput {
  name: string;
  brand?: string;
  purchaseUrl?: string;
  styleTags?: string[];
}

/** 제안: 상세 응답에 포함될 옷 정보 */
export interface ClothingItem {
  id: number;
  name: string;
  imageUrl: string | null;
  brand: string | null;
  purchaseUrl: string | null;
}

/** PictureResponseDto (+ 제안 필드: id, user, likedByMe, createdAt, clothingItem) */
export interface Picture {
  id: number;
  description: string | null;
  imageUrl: string;
  likesCount: number;
  pictureType: PictureType;
  styleTags: string[];
  user?: UserSummary | null;
  likedByMe?: boolean;
  createdAt?: string;
  clothingItem?: ClothingItem | null;
}

export interface UploadPictureInput {
  file: File;
  pictureType: PictureType;
  description: string;
  styleTags: string[];
  clothingItem?: ClothingItemInput;
}

export interface UpdatePictureInput {
  description: string;
  imageUrl: string;
  pictureType: PictureType;
  styleTags: string[];
}

export interface FeedQuery {
  type?: PictureType;
  tag?: string;
  userId?: number;
  page?: number;
  size?: number;
}

export interface PageResult<T> {
  content: T[];
  page: number;
  size: number;
  hasNext: boolean;
  /** 백엔드에 API가 없어 예시 데이터로 대체됐는지 */
  mock?: boolean;
}

/** 제안: GET /api/closet/me 응답 항목 */
export interface ClosetEntry {
  closetItemId: number;
  source: ClosetItemSource;
  clothingItem: ClothingItem;
}
