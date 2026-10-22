import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { FeedGrid } from "../components/FeedGrid";
import { normalizeTag, POPULAR_TAGS } from "../lib/labels";
import { clearRecent, getRecent, pushRecent, removeRecent } from "../lib/recentSearches";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const tag = params.get("tag") ?? "";
  const [draft, setDraft] = useState(tag);
  const [recent, setRecent] = useState(getRecent);

  const go = (raw: string) => {
    const t = normalizeTag(raw);
    if (!t) return;
    setDraft(t);
    setRecent(pushRecent(t));
    setParams({ tag: t });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(draft);
  };

  const reset = () => {
    setDraft("");
    setParams({});
  };

  return (
    <>
      <header className="search-header">
        {tag && (
          <button className="icon-btn" onClick={reset} aria-label="검색 처음으로">
            <ArrowLeft size={22} />
          </button>
        )}
        <form className="search-box" onSubmit={submit} role="search">
          <SearchIcon size={18} aria-hidden="true" />
          <input
            type="search"
            enterKeyHint="search"
            placeholder="스타일 태그로 찾기"
            aria-label="스타일 태그로 찾기"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          {draft && (
            <button type="button" className="search-clear" onClick={() => setDraft("")} aria-label="입력 지우기">
              <X size={16} />
            </button>
          )}
        </form>
      </header>

      {tag ? (
        <>
          <h1 className="result-title">#{tag}</h1>
          <FeedGrid
            query={{ tag }}
            empty={<EmptyState title={`#${tag} 사진이 아직 없어요`} body="다른 태그로 찾아보거나, 이 태그로 첫 사진을 올려 보세요." />}
          />
        </>
      ) : (
        <div className="search-home">
          {recent.length > 0 && (
            <section>
              <div className="section-head">
                <h2 className="section-title">최근 검색</h2>
                <button
                  className="text-btn"
                  onClick={() => {
                    clearRecent();
                    setRecent([]);
                  }}
                >
                  모두 지우기
                </button>
              </div>
              <div className="chip-row">
                {recent.map((r) => (
                  <span key={r} className="chip chip-removable">
                    <button onClick={() => go(r)}>{r}</button>
                    <button aria-label={`${r} 기록 지우기`} onClick={() => setRecent(removeRecent(r))}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="section-title">스타일 둘러보기</h2>
            <div className="tag-tiles">
              {POPULAR_TAGS.map((t) => (
                <button key={t} className="tag-tile" onClick={() => go(t)}>
                  {t}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
