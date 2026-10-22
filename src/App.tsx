import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import { AppShell } from "./components/AppShell";
import { ClosetPage } from "./pages/ClosetPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PinDetailPage } from "./pages/PinDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
import { SignupPage } from "./pages/SignupPage";
import { UploadPage } from "./pages/UploadPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 하단 탭이 있는 화면 */}
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="closet" element={<RequireAuth><ClosetPage /></RequireAuth>} />
        <Route path="me" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      </Route>

      {/* 전체 화면 */}
      <Route path="/pin/:id" element={<PinDetailPage />} />
      <Route path="/upload" element={<RequireAuth><UploadPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
