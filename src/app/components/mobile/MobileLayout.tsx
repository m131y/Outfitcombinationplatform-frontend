import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-lg mx-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
