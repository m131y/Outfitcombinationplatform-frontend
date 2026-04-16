import { Link, useLocation } from "react-router";
import { Home, Search, Plus, FolderOpen } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Search", icon: Search },
    { path: "/upload", label: "Add", icon: Plus, isSpecial: true },
    { path: "/saved", label: "Saved", icon: FolderOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ path, label, icon: Icon, isSpecial }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                  isSpecial
                    ? "relative -top-4"
                    : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full transition-all ${
                    isSpecial
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg"
                      : isActive
                      ? "text-cyan-500"
                      : "text-gray-400"
                  }`}
                >
                  <Icon className={isSpecial ? "w-6 h-6" : "w-5 h-5"} strokeWidth={2} />
                </div>
                {!isSpecial && (
                  <span
                    className={`text-xs ${
                      isActive ? "text-cyan-500 font-medium" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
