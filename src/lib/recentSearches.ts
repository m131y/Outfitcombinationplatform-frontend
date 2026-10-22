const KEY = "outfit.recentSearches";

export function getRecent(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecent(q: string) {
  const list = [q, ...getRecent().filter((x) => x !== q)].slice(0, 10);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* 저장 불가 환경 */
  }
  return list;
}

export function removeRecent(q: string) {
  const list = getRecent().filter((x) => x !== q);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* 저장 불가 환경 */
  }
  return list;
}

export function clearRecent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 저장 불가 환경 */
  }
}
