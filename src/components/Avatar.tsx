import type { UserSummary } from "../api/types";
import { displayName } from "../lib/labels";

export function Avatar({ user, size = 28 }: { user?: UserSummary | null; size?: number }) {
  const name = displayName(user);
  if (user?.profileImageUrl) {
    return <img className="avatar" src={user.profileImageUrl} alt="" width={size} height={size} />;
  }
  return (
    <span className="avatar avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {name.slice(0, 1)}
    </span>
  );
}
