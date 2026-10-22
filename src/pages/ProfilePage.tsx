import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";
import { FeedGrid } from "../components/FeedGrid";
import { displayName } from "../lib/labels";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();
  if (!user) return null;

  return (
    <>
      <header className="profile">
        <Avatar user={user} size={88} />
        <h1 className="profile-name">{displayName(user)}</h1>
        {user.email && <p className="profile-email">{user.email}</p>}
        <button
          className="btn btn-secondary btn-small"
          onClick={() => {
            logout();
            qc.clear();
          }}
        >
          <LogOut size={16} /> 로그아웃
        </button>
      </header>
      <h2 className="profile-section">내가 올린 사진</h2>
      <FeedGrid
        query={{ userId: user.id }}
        showAuthor={false}
        empty={
          <EmptyState
            title="아직 올린 사진이 없어요"
            action={
              <Link to="/upload" className="btn btn-primary">
                첫 사진 올리기
              </Link>
            }
          />
        }
      />
    </>
  );
}
