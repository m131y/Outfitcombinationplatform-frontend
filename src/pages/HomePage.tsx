import { Link, useSearchParams } from "react-router-dom";
import type { PictureType } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { FeedGrid } from "../components/FeedGrid";
import { TYPE_LABEL } from "../lib/labels";

const TABS: (PictureType | "ALL")[] = ["ALL", "OOTD", "STYLE", "ITEM"];

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("type");
  const type = TABS.includes(raw as PictureType) ? (raw as PictureType) : undefined;

  return (
    <>
      <header className="home-header">
        <nav className="feed-tabs" aria-label="사진 종류">
          {TABS.map((t) => {
            const active = (t === "ALL" && !type) || t === type;
            return (
              <button
                key={t}
                className="feed-tab"
                aria-current={active ? "page" : undefined}
                onClick={() => setParams(t === "ALL" ? {} : { type: t }, { replace: true })}
              >
                {t === "ALL" ? "전체" : TYPE_LABEL[t]}
              </button>
            );
          })}
        </nav>
      </header>
      <FeedGrid
        query={{ type }}
        empty={
          <EmptyState
            title="아직 올라온 사진이 없어요"
            body="오늘 입은 옷을 첫 번째로 올려 보세요."
            action={
              <Link to="/upload" className="btn btn-primary">
                코디 올리기
              </Link>
            }
          />
        }
      />
    </>
  );
}
