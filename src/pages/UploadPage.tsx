import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { uploadPicture } from "../api/pictures";
import type { PictureType } from "../api/types";
import { TagInput } from "../components/TagInput";
import { useToast } from "../components/Toast";
import { TypePicker } from "../components/TypePicker";

const MAX_MB = 10;

export function UploadPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const [params] = useSearchParams();
  const initialType = (["OOTD", "STYLE", "ITEM"] as const).find((t) => t === params.get("type")) ?? "OOTD";

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState<PictureType>(initialType);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [item, setItem] = useState({ name: "", brand: "", purchaseUrl: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("사진 파일만 올릴 수 있어요.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`${MAX_MB}MB 이하 사진을 골라 주세요.`);
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const m = useMutation({
    mutationFn: () =>
      uploadPicture({
        file: file!,
        pictureType: type,
        description: description.trim(),
        styleTags: tags,
        clothingItem:
          type === "ITEM"
            ? { name: item.name.trim(), brand: item.brand.trim() || undefined, purchaseUrl: item.purchaseUrl.trim() || undefined }
            : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["closet"] });
      toast.show("사진을 올렸어요");
      navigate("/", { replace: true });
    },
    onError: (err) => setError(err.message),
  });

  const submit = () => {
    if (!file) return setError("올릴 사진을 골라 주세요.");
    if (type === "ITEM" && !item.name.trim()) return setError("아이템 이름을 입력해 주세요.");
    if (item.purchaseUrl && !/^https?:\/\//.test(item.purchaseUrl.trim()))
      return setError("구매 링크는 http:// 또는 https:// 로 시작해야 해요.");
    setError(null);
    m.mutate();
  };

  return (
    <div className="upload">
      <header className="sub-header">
        <button className="icon-btn" aria-label="닫기" onClick={() => navigate(-1)}>
          <X size={24} />
        </button>
        <h1 className="sub-title">새 사진</h1>
        <span className="sub-spacer" />
      </header>

      <label className={preview ? "picker picker-filled" : "picker"}>
        <input type="file" accept="image/*" onChange={pick} className="sr-only" />
        {preview ? (
          <>
            <img src={preview} alt="올릴 사진 미리보기" />
            <span className="picker-change">사진 바꾸기</span>
          </>
        ) : (
          <span className="picker-empty">
            <ImagePlus size={36} strokeWidth={1.6} />
            <span>사진 고르기</span>
          </span>
        )}
      </label>

      <div className="form upload-form">
        <div className="field">
          <span className="field-label">어떤 사진인가요?</span>
          <TypePicker value={type} onChange={setType} />
        </div>

        {type === "ITEM" && (
          <fieldset className="item-fields">
            <legend className="field-label">아이템 정보</legend>
            <input
              className="input"
              placeholder="이름 (필수) 예: 울 블렌드 코트"
              aria-label="아이템 이름"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="브랜드"
              aria-label="브랜드"
              value={item.brand}
              onChange={(e) => setItem({ ...item, brand: e.target.value })}
            />
            <input
              className="input"
              type="url"
              inputMode="url"
              placeholder="구매 링크 https://"
              aria-label="구매 링크"
              value={item.purchaseUrl}
              onChange={(e) => setItem({ ...item, purchaseUrl: e.target.value })}
            />
          </fieldset>
        )}

        <label className="field">
          <span className="field-label">설명</span>
          <textarea
            className="input textarea"
            rows={3}
            placeholder={type === "OOTD" ? "오늘 어디 가는 길이었나요?" : "어떤 점이 좋았나요?"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="field">
          <label className="field-label" htmlFor="tags">
            스타일 태그
          </label>
          <TagInput value={tags} onChange={setTags} />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="upload-bar">
        <button className="btn btn-primary btn-block" onClick={submit} disabled={m.isPending}>
          {m.isPending ? "올리는 중…" : "올리기"}
        </button>
      </div>
    </div>
  );
}
