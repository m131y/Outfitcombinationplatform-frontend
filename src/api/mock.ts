// 백엔드에 아직 없는 API를 대신하는 예시 데이터입니다.
// 사진 대신 색 면 위에 옷 실루엣을 그린 SVG를 써서 예시라는 게 바로 보이게 했습니다.
import type {
  AuthResponse,
  ClosetEntry,
  FeedQuery,
  PageResult,
  Picture,
  PictureType,
  UpdatePictureInput,
  UploadPictureInput,
  User,
  UserSummary,
} from "./types";

const delay = (ms = 280) => new Promise((r) => setTimeout(r, ms));

const SHAPES: Record<string, string> = {
  tee: "M30 18 L42 12 Q50 20 58 12 L70 18 L86 34 L75 44 L70 40 L70 88 L30 88 L30 40 L25 44 L14 34 Z",
  pants: "M33 10 H67 L73 90 H56 L50 42 L44 90 H27 Z",
  coat: "M34 10 L44 8 L50 30 L56 8 L66 10 L80 22 L76 90 H24 L20 22 Z",
  dress: "M40 8 H60 L62 30 L80 90 H20 L38 30 Z",
  shoe: "M14 58 L20 40 L36 42 Q46 54 66 56 L86 62 L88 74 H14 Z",
  bag: "M24 38 H76 L80 88 H20 Z M38 38 Q38 18 50 18 Q62 18 62 38",
};

const PALETTE: [string, string][] = [
  ["#d9dde8", "#3a4766"],
  ["#ece3d6", "#7a5a3a"],
  ["#dfe7dc", "#3f5a3c"],
  ["#e9dadf", "#7b3d4f"],
  ["#d8e3ea", "#2f5e78"],
  ["#e6e3dc", "#3b3a36"],
  ["#efe6c9", "#6e5a1a"],
  ["#e0dbe9", "#4b3d70"],
];

function tile(ratio: number, colorIdx: number, shape: string) {
  const w = 300;
  const h = Math.round(w * ratio);
  const [bg, fg] = PALETTE[colorIdx % PALETTE.length];
  const size = Math.min(w, h) * 0.62;
  const x = (w - size) / 2;
  const y = (h - size) / 2;
  const s = size / 100;
  const isBag = shape === "bag";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${bg}"/>` +
    `<path transform="translate(${x} ${y}) scale(${s})" d="${SHAPES[shape]}" fill="${isBag ? "none" : fg}" stroke="${fg}" stroke-width="${isBag ? 5 : 0}" stroke-linejoin="round"/>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const TAGS = ["미니멀", "스트릿", "캐주얼", "빈티지", "오피스룩", "아메카지", "고프코어", "러블리", "데님", "모노톤"];
const USERS: UserSummary[] = [
  { id: 1, nickname: "나", profileImageUrl: null },
  { id: 2, nickname: "하루", profileImageUrl: null },
  { id: 3, nickname: "옷장정리중", profileImageUrl: null },
  { id: 4, nickname: "데님러버", profileImageUrl: null },
  { id: 5, nickname: "minimal.k", profileImageUrl: null },
];
const DESCRIPTIONS: Record<PictureType, string[]> = {
  OOTD: ["출근길 셔츠에 와이드 슬랙스", "주말 카페 갈 때 입은 옷", "비 오는 날 레이어드", "오늘은 올블랙", "가을 첫 트렌치"],
  STYLE: ["이런 톤온톤 조합 좋아요", "따라 입고 싶은 니트 레이어드", "빈티지 데님 셋업 참고용", "여름 린넨 조합 모음"],
  ITEM: ["크롭 가디건", "스트레이트 데님 팬츠", "레더 로퍼", "울 블렌드 코트", "캔버스 토트백"],
};
const ITEM_SHAPES = ["tee", "pants", "shoe", "coat", "bag"];
const BRANDS = ["무신사 스탠다드", "유니클로", "COS", "빈티지샵", null];

let nextId = 1000;
const pictures: Picture[] = [];

(function seed() {
  const types: PictureType[] = ["OOTD", "STYLE", "ITEM"];
  const ratios = [1.25, 1.5, 1.33, 1.0, 1.6, 1.4, 1.2, 1.75];
  for (let i = 0; i < 44; i++) {
    const type = types[i % 3];
    const descs = DESCRIPTIONS[type];
    const shape = type === "ITEM" ? ITEM_SHAPES[i % ITEM_SHAPES.length] : ["tee", "dress", "coat", "pants"][i % 4];
    const user = USERS[(i * 3) % USERS.length];
    const tags = [TAGS[i % TAGS.length], TAGS[(i * 7 + 3) % TAGS.length]].filter((t, k, a) => a.indexOf(t) === k);
    const imageUrl = tile(ratios[i % ratios.length], i, shape);
    pictures.push({
      id: i + 1,
      description: descs[i % descs.length],
      imageUrl,
      likesCount: ((i * 37) % 120) + (i % 9 === 0 ? 1 : 0),
      pictureType: type,
      styleTags: tags,
      user,
      likedByMe: i % 9 === 0,
      createdAt: new Date(Date.now() - i * 3600_000 * 7).toISOString(),
      clothingItem:
        type === "ITEM"
          ? {
              id: 500 + i,
              name: descs[i % descs.length],
              imageUrl,
              brand: BRANDS[i % BRANDS.length],
              purchaseUrl: i % 2 === 0 ? "https://example.com" : null,
            }
          : null,
    });
  }
})();

const closet: ClosetEntry[] = pictures
  .filter((p) => p.clothingItem)
  .slice(0, 7)
  .map((p, i) => ({
    closetItemId: 900 + i,
    source: p.user?.id === 1 ? "UPLOADED" : "FROM_POST",
    clothingItem: p.clothingItem!,
  }));

function notFound(): never {
  throw Object.assign(new Error("찾는 사진이 없어요."), { status: 404 });
}

export const mock = {
  me: USERS[0],

  async login(): Promise<AuthResponse> {
    await delay();
    return { access_token: "mock-token", refresh_token: "mock-refresh", tokenType: "Bearer", user: USERS[0] };
  },

  async fetchMe(): Promise<User> {
    await delay(120);
    return { ...USERS[0], email: "me@example.com", authProvider: "LOCAL", createdAt: new Date().toISOString() };
  },

  async feed(q: FeedQuery): Promise<PageResult<Picture>> {
    await delay();
    const page = q.page ?? 0;
    const size = q.size ?? 20;
    const tag = q.tag?.trim().replace(/^#/, "");
    const list = pictures.filter(
      (p) =>
        (!q.type || p.pictureType === q.type) &&
        (!q.userId || p.user?.id === q.userId) &&
        (!tag || p.styleTags.includes(tag) || (p.description ?? "").includes(tag)),
    );
    const content = list.slice(page * size, page * size + size);
    return { content, page, size, hasNext: (page + 1) * size < list.length, mock: true };
  },

  async picture(id: number): Promise<Picture> {
    await delay(160);
    return pictures.find((p) => p.id === id) ?? notFound();
  },

  async toggleLike(id: number) {
    await delay(120);
    const p = pictures.find((x) => x.id === id) ?? notFound();
    p.likedByMe = !p.likedByMe;
    p.likesCount += p.likedByMe ? 1 : -1;
    return { liked: !!p.likedByMe, likesCount: p.likesCount };
  },

  async upload(input: UploadPictureInput): Promise<Picture> {
    await delay(500);
    const imageUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.readAsDataURL(input.file);
    });
    const id = nextId++;
    const pic: Picture = {
      id,
      description: input.description || null,
      imageUrl,
      likesCount: 0,
      pictureType: input.pictureType,
      styleTags: input.styleTags,
      user: USERS[0],
      likedByMe: false,
      createdAt: new Date().toISOString(),
      clothingItem: input.clothingItem
        ? {
            id: nextId++,
            name: input.clothingItem.name,
            imageUrl,
            brand: input.clothingItem.brand || null,
            purchaseUrl: input.clothingItem.purchaseUrl || null,
          }
        : null,
    };
    pictures.unshift(pic);
    if (pic.clothingItem) closet.unshift({ closetItemId: nextId++, source: "UPLOADED", clothingItem: pic.clothingItem });
    return pic;
  },

  async update(id: number, input: UpdatePictureInput): Promise<Picture> {
    await delay();
    const p = pictures.find((x) => x.id === id) ?? notFound();
    Object.assign(p, input);
    return p;
  },

  async remove(id: number) {
    await delay();
    const i = pictures.findIndex((x) => x.id === id);
    if (i >= 0) pictures.splice(i, 1);
  },

  async closet(): Promise<ClosetEntry[]> {
    await delay();
    return [...closet];
  },

  async addToCloset(clothingItemId: number) {
    await delay(200);
    if (closet.some((c) => c.clothingItem.id === clothingItemId)) return;
    const item = pictures.find((p) => p.clothingItem?.id === clothingItemId)?.clothingItem;
    if (item) closet.unshift({ closetItemId: nextId++, source: "FROM_POST", clothingItem: item });
  },

  async removeFromCloset(closetItemId: number) {
    await delay(200);
    const i = closet.findIndex((c) => c.closetItemId === closetItemId);
    if (i >= 0) closet.splice(i, 1);
  },
};
