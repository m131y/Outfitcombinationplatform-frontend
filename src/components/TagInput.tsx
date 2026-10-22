import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { normalizeTag, POPULAR_TAGS } from "../lib/labels";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export function TagInput({ value, onChange, max = 8 }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const t = normalizeTag(raw);
    if (!t || value.includes(t) || value.length >= max) return;
    onChange([...value, t]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 무시
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const suggestions = POPULAR_TAGS.filter((t) => !value.includes(t)).slice(0, 6);

  return (
    <div className="tag-input">
      <div className="tag-field">
        {value.map((t) => (
          <span key={t} className="chip chip-solid">
            #{t}
            <button type="button" aria-label={`${t} 태그 지우기`} onClick={() => onChange(value.filter((x) => x !== t))}>
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          id="tags"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            add(draft);
            setDraft("");
          }}
          placeholder={value.length ? "" : "예: 미니멀, 데님"}
          disabled={value.length >= max}
        />
      </div>
      {suggestions.length > 0 && value.length < max && (
        <div className="tag-suggest">
          {suggestions.map((t) => (
            <button type="button" key={t} className="chip" onClick={() => add(t)}>
              #{t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
