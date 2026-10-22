import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { APP_NAME } from "../lib/labels";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={next} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      setError("이메일(또는 아이디)과 비밀번호를 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login({ loginId, password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인하지 못했어요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <p className="wordmark">{APP_NAME}</p>
        <h1 className="auth-title">오늘 뭐 입지,<br />여기서 고르기</h1>
      </div>
      <form className="form" onSubmit={submit} noValidate>
        <label className="field">
          <span className="field-label">이메일 또는 아이디</span>
          <input
            className="input"
            autoComplete="username"
            autoCapitalize="none"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">비밀번호</span>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "로그인 중…" : "로그인"}
        </button>
        <p className="auth-switch">
          처음이라면 <Link to={`/signup?next=${encodeURIComponent(next)}`}>회원가입</Link>
        </p>
        <Link to="/" className="auth-skip">
          로그인 없이 둘러보기
        </Link>
      </form>
    </div>
  );
}
