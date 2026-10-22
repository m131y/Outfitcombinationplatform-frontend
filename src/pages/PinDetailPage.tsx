import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Heart, Link2, MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCloset } from "../api/closet";
import { deletePicture, fetchPicture, toggleLike, updatePicture } from "../api/pictures";
import type { Picture, PictureType } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { FeedGrid } from "../components/FeedGrid";
import { Sheet } from "../components/Sheet";
import { Spinner } from "../components/Spinner";
import { TagInput } from "../components/TagInput";
import { useToast } from "../components/Toast";
import { TypePicker } from "../components/TypePicker";
import { displayName, TYPE_LABEL } from "../lib/labels";

export function PinDetailPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const q = useQuery({ queryKey: ["picture", id], queryFn: () => fetchPicture(id), enabled: Number.isFinite(id) });

  const requireLogin = useCallback(() => {
    navigate(`/login?next=${encodeURIComponent(`/pin/${id}`)}`);
  }, [navigate, id]);

  const like = useMutation({
    mutationFn: () => toggleLike(id),
    onMutate: async () => {
      const prev = qc.getQueryData<Picture>(["picture", id]);
      if (prev) {
        const liked = !prev.likedByMe;
        qc.setQueryData<Picture>(["picture", id], { ...prev, likedByMe: liked, likesCount: prev.likesCount + (liked ? 1 : -1) });
      }
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["picture", id], ctx.prev);
      toast.show(err.message);
    },
    onSuccess: (res) => {
      qc.setQueryData<Picture>(["picture", id], (p) => (p ? { ...p, likedByMe: res.liked, likesCount: res.likesCount } : p));
    },
  });

  const save = useMutation({
    mutationFn: (clothingItemId: number) => addToCloset(clothingItemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["closet"] });
      toast.show("옷장에 담았어요");
    },
    onError: (err) => toast.show(err.message),
  });

  const remove = useMutation({
    mutationFn: () => deletePicture(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.removeQueries({ queryKey: ["picture", id] });
      toast.show("사진을 삭제했어요");
      navigate("/", { replace: true });
    },
    onError: (err) => toast.show(err.message),
  });

  if (q.isPending) return <Spinner block />;
  if (q.isError || !q.data) {
    return (
      <div className="detail">
        <BackButton />
        <EmptyState
          title="사진을 찾을 수 없어요"
          body="삭제됐거나 주소가 잘못됐을 수 있어요."
          action={
            <Link to="/" className="btn btn-secondary">
              홈으로
            </Link>
          }
        />
      </div>
    );
  }

  const p = q.data;
  const isOwner = !!user && p.user?.id === user.id;
  const item = p.pictureType === "ITEM" ? p.clothingItem : null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.show("링크를 복사했어요");
    } catch {
      toast.show("링크를 복사하지 못했어요");
    }
  };

  return (
    <div className="detail">
      <div className="detail-media">
        <img src={p.imageUrl} alt={p.description || `${TYPE_LABEL[p.pictureType]} 사진`} />
        <BackButton floating />
        {isOwner && (
          <button className="icon-btn icon-btn-float detail-more" aria-label="사진 관리" onClick={() => setMenuOpen(true)}>
            <MoreHorizontal size={22} />
          </button>
        )}
      </div>

      <div className="detail-body">
        <div className="detail-actions">
          <button
            className="like-btn"
            aria-pressed={!!p.likedByMe}
            onClick={() => (user ? like.mutate() : requireLogin())}
            disabled={like.isPending}
          >
            <Heart size={24} fill={p.likedByMe ? "currentColor" : "none"} />
            <span>{p.likesCount}</span>
            <span className="sr-only">{p.likedByMe ? "좋아요 취소" : "좋아요"}</span>
          </button>
          <button className="icon-btn" aria-label="링크 복사" onClick={copyLink}>
            <Link2 size={22} />
          </button>
          {item && (
            <button
              className="btn btn-primary detail-save"
              onClick={() => (user ? save.mutate(item.id) : requireLogin())}
              disabled={save.isPending}
            >
              {save.isPending ? "담는 중…" : "옷장에 담기"}
            </button>
          )}
        </div>

        {item && (
          <div className="item-card">
            <div>
              <p className="item-name">{item.name}</p>
              {item.brand && <p className="item-brand">{item.brand}</p>}
            </div>
            {item.purchaseUrl && (
              <a className="btn btn-secondary btn-small" href={item.purchaseUrl} target="_blank" rel="noreferrer noopener">
                구매처 <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        <p className="detail-type">{TYPE_LABEL[p.pictureType]}</p>
        {p.description && <p className="detail-desc">{p.description}</p>}
        {p.styleTags.length > 0 && (
          <div className="chip-row">
            {p.styleTags.map((t) => (
              <Link key={t} to={`/search?tag=${encodeURIComponent(t)}`} className="chip">
                #{t}
              </Link>
            ))}
          </div>
        )}
        {p.user && (
          <div className="detail-author">
            <Avatar user={p.user} size={36} />
            <span>{displayName(p.user)}</span>
          </div>
        )}
      </div>

      {p.styleTags[0] && (
        <section className="related">
          <h2 className="related-title">비슷한 스타일</h2>
          <FeedGrid query={{ tag: p.styleTags[0] }} excludeId={p.id} hideMockNote empty={null} />
        </section>
      )}

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="사진 관리">
        <div className="sheet-actions">
          <button
            className="sheet-action"
            onClick={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            수정하기
          </button>
          <button
            className="sheet-action sheet-action-danger"
            onClick={() => {
              setMenuOpen(false);
              setConfirmOpen(true);
            }}
          >
            삭제하기
          </button>
        </div>
      </Sheet>

      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} title="이 사진을 삭제할까요?">
        <p className="sheet-text">삭제하면 되돌릴 수 없어요.</p>
        <div className="sheet-buttons">
          <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>
            취소
          </button>
          <button className="btn btn-danger" onClick={() => remove.mutate()} disabled={remove.isPending}>
            {remove.isPending ? "삭제 중…" : "삭제"}
          </button>
        </div>
      </Sheet>

      {editOpen && <EditSheet picture={p} onClose={() => setEditOpen(false)} />}
    </div>
  );
}

function BackButton({ floating = false }: { floating?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      className={floating ? "icon-btn icon-btn-float detail-back" : "icon-btn"}
      aria-label="뒤로"
      onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
    >
      <ArrowLeft size={22} />
    </button>
  );
}

function EditSheet({ picture, onClose }: { picture: Picture; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [description, setDescription] = useState(picture.description ?? "");
  const [tags, setTags] = useState(picture.styleTags);
  const [type, setType] = useState<PictureType>(picture.pictureType);

  const m = useMutation({
    mutationFn: () =>
      updatePicture(picture.id, { description, styleTags: tags, pictureType: type, imageUrl: picture.imageUrl }),
    onSuccess: (updated) => {
      qc.setQueryData<Picture>(["picture", picture.id], (p) => (p ? { ...p, ...updated, id: p.id } : p));
      qc.invalidateQueries({ queryKey: ["feed"] });
      toast.show("수정했어요");
      onClose();
    },
    onError: (err) => toast.show(err.message),
  });

  return (
    <Sheet open onClose={onClose} title="사진 수정">
      <div className="form">
        <div className="field">
          <span className="field-label">종류</span>
          <TypePicker value={type} onChange={setType} />
        </div>
        <label className="field">
          <span className="field-label">설명</span>
          <textarea className="input textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="field">
          <label className="field-label" htmlFor="tags">
            스타일 태그
          </label>
          <TagInput value={tags} onChange={setTags} />
        </div>
        <button className="btn btn-primary btn-block" onClick={() => m.mutate()} disabled={m.isPending}>
          {m.isPending ? "저장 중…" : "저장"}
        </button>
      </div>
    </Sheet>
  );
}
