# Outfit Combination Platform — Frontend

핀터레스트처럼 코디 사진을 둘러보고, 올리고, 마음에 드는 아이템을 내 옷장에 담는 모바일 우선 웹앱입니다.

React 18 · TypeScript · Vite · React Router · TanStack Query

## 실행

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
```

백엔드 `SecurityConfig` 의 CORS 허용 주소(`frontend.url`)가 `http://localhost:3000` 이라서 개발 서버도 3000 포트로 고정했어요.

### 백엔드 없이 UI만 볼 때

`.env` 에서 `VITE_USE_MOCK=true` 로 바꾸면 로그인부터 업로드까지 전부 예시 데이터로 동작합니다.

### 백엔드와 같이 쓸 때 (`VITE_USE_MOCK=false`)

이미 있는 API는 실제로 호출하고, 아직 없는 API는 백엔드가 404/405를 돌려주면 자동으로 예시 데이터로 대체합니다.
백엔드에 API를 추가하면 프론트 수정 없이 실제 데이터로 바뀌어요. 추가 방법은 `BACKEND_NOTES.md` 에 있습니다.

| 기능 | API | 상태 |
| --- | --- | --- |
| 회원가입 / 로그인 | `POST /api/auth/signup`, `POST /api/auth/login` | 연결됨 |
| 내 정보 | `GET /api/user/me` | 연결됨 |
| 사진 올리기 | `POST /api/pictures` (multipart: `data` JSON + `image`) | 연결됨 |
| 사진 수정 / 삭제 | `PUT`, `DELETE /api/pictures/{id}` | 연결됨 (PUT은 백엔드에 `@RequestBody` 필요) |
| 옷장 만들기 | `POST /api/closet` | 연결됨 (가입 직후, 담기 직전에 자동 호출) |
| 옷장에 담기 / 빼기 | `POST /api/closet/item/add/{id}`, `DELETE /api/closet/item/delete/{id}` | 연결됨 (컨트롤러가 서비스를 호출하도록 수정 필요) |
| 피드 목록 / 태그 검색 / 내 사진 | `GET /api/pictures?type=&tag=&userId=&page=&size=` | 백엔드 추가 필요 → 예시 데이터 |
| 사진 상세 | `GET /api/pictures/{id}` | 백엔드 추가 필요 → 예시 데이터 |
| 좋아요 | `POST /api/pictures/{id}/like` | 백엔드 추가 필요 → 예시 데이터 |
| 내 옷장 조회 | `GET /api/closet/me` | 백엔드 추가 필요 → 예시 데이터 |

## 화면

| 경로 | 화면 | 로그인 |
| --- | --- | --- |
| `/` | 홈 피드 (전체 / OOTD / 스타일 / 아이템 탭, 무한 스크롤 메이슨리) | |
| `/search` | 스타일 태그 검색, 최근 검색, 태그 둘러보기 | |
| `/pin/:id` | 사진 상세: 좋아요, 링크 복사, 옷장에 담기(아이템), 구매처, 비슷한 스타일, 내 사진 수정/삭제 | 일부 |
| `/upload` | 사진 올리기 (종류 선택, 아이템 정보, 설명, 태그) | 필요 |
| `/closet` | 내 옷장 (전체 / 내가 올린 / 담아온) | 필요 |
| `/me` | 프로필, 내가 올린 사진, 로그아웃 | 필요 |
| `/login`, `/signup` | 로그인, 회원가입 | |

## 구조

```
src/
  api/          백엔드 호출 (client.ts: fetch 래퍼 + JWT + ApiResponse 풀기, mock.ts: 예시 데이터)
  auth/         로그인 상태, 보호 라우트
  components/   하단 탭, 메이슨리 카드, 시트, 태그 입력 등
  pages/        화면 단위
  lib/          라벨, 최근 검색, 무한 스크롤/메이슨리 훅
  styles/       global.css (색, 글꼴 토큰 포함, 다크 모드 지원)
```

메이슨리는 CSS grid 의 `grid-auto-rows: 4px` 위에서 카드마다 실제 높이를 재서 `grid-row-end: span N` 을 주는 방식이에요.
사진 크기를 미리 몰라도 되고, 무한 스크롤로 카드가 붙어도 이미 보이던 카드 순서가 바뀌지 않습니다.
