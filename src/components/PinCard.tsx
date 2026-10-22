import { useState } from "react";
import { Link } from "react-router-dom";
import type { Picture } from "../api/types";
import { useRowSpan } from "../lib/useRowSpan";
import { displayName, TYPE_LABEL } from "../lib/labels";
import { Avatar } from "./Avatar";

export function PinCard({ picture, showAuthor = true }: { picture: Picture; showAuthor?: boolean }) {
  const { ref, span } = useRowSpan();
  const [loaded, setLoaded] = useState(false);
  const alt = picture.description || `${TYPE_LABEL[picture.pictureType]} 사진`;

  return (
    <article className="pin" style={{ gridRowEnd: `span ${span}` }}>
      <div ref={ref} className="pin-inner">
        <Link to={`/pin/${picture.id}`} className="pin-media" data-loaded={loaded}>
          <img src={picture.imageUrl} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
          {picture.pictureType === "ITEM" && <span className="pin-badge">아이템</span>}
        </Link>
        {(picture.description || showAuthor) && (
          <div className="pin-meta">
            {picture.description && <p className="pin-desc">{picture.description}</p>}
            {showAuthor && picture.user && (
              <p className="pin-author">
                <Avatar user={picture.user} size={20} />
                <span>{displayName(picture.user)}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
