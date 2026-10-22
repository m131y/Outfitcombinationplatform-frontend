import type { PictureType } from "../api/types";
import { TYPE_HINT, TYPE_LABEL } from "../lib/labels";

const TYPES: PictureType[] = ["OOTD", "STYLE", "ITEM"];

export function TypePicker({ value, onChange }: { value: PictureType; onChange: (t: PictureType) => void }) {
  return (
    <div className="type-picker" role="radiogroup" aria-label="사진 종류">
      {TYPES.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={value === t}
          className="type-option"
          onClick={() => onChange(t)}
        >
          <span className="type-option-label">{TYPE_LABEL[t]}</span>
          <span className="type-option-hint">{TYPE_HINT[t]}</span>
        </button>
      ))}
    </div>
  );
}
