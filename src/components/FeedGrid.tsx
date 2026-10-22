import { useInfiniteQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { fetchFeed } from "../api/pictures";
import type { FeedQuery } from "../api/types";
import { useInView } from "../lib/useInView";
import { MASONRY_ROW } from "../lib/useRowSpan";
import { PinCard } from "./PinCard";
import { Spinner } from "./Spinner";

interface FeedGridProps {
  query: Omit<FeedQuery, "page">;
  excludeId?: number;
  showAuthor?: boolean;
  hideMockNote?: boolean;
  empty: ReactNode;
}

export function FeedGrid({ query, excludeId, showAuthor = true, hideMockNote = false, empty }: FeedGridProps) {
  const q = useInfiniteQuery({
    queryKey: ["feed", query],
    queryFn: ({ pageParam }) => fetchFeed({ ...query, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
  });

  const sentinel = useInView(() => {
    if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
  }, !!q.hasNextPage);

  if (q.isPending) return <Spinner block />;
  if (q.isError) {
    return (
      <div className="state">
        <p className="state-title">피드를 불러오지 못했어요</p>
        <p className="state-body">{q.error.message}</p>
        <button className="btn btn-secondary" onClick={() => q.refetch()}>
          다시 불러오기
        </button>
      </div>
    );
  }

  const items = q.data.pages.flatMap((p) => p.content).filter((p) => p.id !== excludeId);
  const isMock = q.data.pages[0]?.mock;

  if (items.length === 0) return <>{empty}</>;

  return (
    <>
      {isMock && !hideMockNote && (
        <p className="mock-note">피드 API가 아직 없어서 예시 데이터를 보여주고 있어요.</p>
      )}
      <div className="masonry" style={{ gridAutoRows: MASONRY_ROW }}>
        {items.map((p) => (
          <PinCard key={p.id} picture={p} showAuthor={showAuthor} />
        ))}
      </div>
      <div ref={sentinel} className="feed-end">
        {q.isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}
