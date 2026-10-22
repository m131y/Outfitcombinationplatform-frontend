import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 백엔드 CORS 설정(frontend.url)이 http://localhost:3000 이라서 3000 포트로 띄웁니다.
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, strictPort: true },
});
