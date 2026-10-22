import { NavLink } from "react-router-dom";
import { Home, Plus, Search, Shirt } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { Avatar } from "./Avatar";

export function BottomNav() {
  const { user } = useAuth();
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <NavLink to="/" end className="nav-item" aria-label="홈">
        <Home size={24} strokeWidth={2.2} />
      </NavLink>
      <NavLink to="/search" className="nav-item" aria-label="검색">
        <Search size={24} strokeWidth={2.2} />
      </NavLink>
      <NavLink to="/upload" className="nav-item nav-upload" aria-label="코디 올리기">
        <Plus size={24} strokeWidth={2.6} />
      </NavLink>
      <NavLink to="/closet" className="nav-item" aria-label="내 옷장">
        <Shirt size={24} strokeWidth={2.2} />
      </NavLink>
      <NavLink to="/me" className="nav-item nav-me" aria-label="내 프로필">
        <Avatar user={user} size={26} />
      </NavLink>
    </nav>
  );
}
