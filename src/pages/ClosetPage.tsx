import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyCloset, removeFromCloset } from "../api/closet";
import type { ClosetEntry, ClosetItemSource } from "../api/types";
import { EmptyState } from "../components/EmptyState";
import { Sheet } from "../components/Sheet";
import { Spinner } from "../components/Spinner";
import { useToast } from "../components/Toast";

const FILTERS: { key: ClosetItemSource | "ALL"; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "UPLOADED", label: "내가 올린" },
  { key: "FROM_POST", label: "담아온" },
];

export function ClosetPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const [filter, setFilter] = useState<ClosetItemSource | "ALL">("ALL");
  const [selected, setSelected] = useState<ClosetEntry | null>(null);
  const q = useQuery({ queryKey: ["closet"], queryFn: fetchMyCloset });

  const remove = useMutation({
    mutationFn: (id: number) => removeFromCloset(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["closet"] });
      setSelected(null);
      toast.show("옷장에서 뺐어요");
    },
    onError: (err) => toast.show(err.message),
  });

  const items = (q.data ?? []).filter((c) => filter === "ALL" || c.source === filter);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">내 옷장</h1>
        {q.data && <span className="page-count">{q.data.length}벌</span>}
      </header>
      <div className="chip-row filter-row" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            className="chip chip-toggle"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {q.isPending ? (
        <Spinner block />
      ) : q.isError ? (
        <EmptyState
          title="옷장을 불러오지 못했어요"
          body={q.error.message}
          action={
            <button className="btn btn-secondary" onClick={() => q.refetch()}>
              다시 불러오기
            </button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={filter === "ALL" ? "옷장이 비어 있어요" : "여기에 해당하는 옷이 없어요"}
          body="가진 옷을 아이템으로 올리거나, 피드에서 마음에 드는 아이템을 담아 보세요."
          action={
            <Link to="/upload?type=ITEM" className="btn btn-primary">
              아이템 올리기
            </Link>
          }
        />
      ) : (
        <ul className="closet-grid">
          {items.map((c) => (
            <li key={c.closetItemId}>
              <button className="closet-cell" onClick={() => setSelected(c)}>
                {c.clothingItem.imageUrl ? (
                  <img src={c.clothingItem.imageUrl} alt="" loading="lazy" />
                ) : (
                  <span className="closet-noimg" />
                )}
                <span className="closet-name">{c.clothingItem.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected?.clothingItem.name}>
        {selected && (
          <>
            <p className="sheet-text">
              {selected.clothingItem.brand ?? "브랜드 정보 없음"}
              <br />
              {selected.source === "UPLOADED" ? "내가 올린 아이템" : "피드에서 담은 아이템"}
            </p>
            <div className="sheet-buttons">
              {selected.clothingItem.purchaseUrl && (
                <a className="btn btn-secondary" href={selected.clothingItem.purchaseUrl} target="_blank" rel="noreferrer noopener">
                  구매처 <ExternalLink size={14} />
                </a>
              )}
              <button
                className="btn btn-danger"
                onClick={() => remove.mutate(selected.closetItemId)}
                disabled={remove.isPending}
              >
                {remove.isPending ? "빼는 중…" : "옷장에서 빼기"}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
}
