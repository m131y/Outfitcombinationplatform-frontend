export function Spinner({ block = false, label = "불러오는 중" }: { block?: boolean; label?: string }) {
  return (
    <div className={block ? "spinner-block" : "spinner-inline"} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
