import { useEffect, useRef } from "react";

/** 요소가 화면 아래쪽에 가까워지면 callback 실행 (무한 스크롤용) */
export function useInView(callback: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && cb.current(), {
      rootMargin: "600px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
