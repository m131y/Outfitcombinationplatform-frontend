import { useLayoutEffect, useRef, useState } from "react";

export const MASONRY_ROW = 4; // px, styles의 grid-auto-rows 와 같아야 해요.

/** CSS grid 메이슨리: 카드 실제 높이에 맞춰 차지할 행 수를 계산합니다. */
export function useRowSpan() {
  const ref = useRef<HTMLDivElement>(null);
  const [span, setSpan] = useState(50);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSpan(Math.max(1, Math.ceil(el.getBoundingClientRect().height / MASONRY_ROW)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, span };
}
