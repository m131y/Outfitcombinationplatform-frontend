import type { ReactNode } from "react";

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <p className="state-title">{title}</p>
      {body && <p className="state-body">{body}</p>}
      {action}
    </div>
  );
}
