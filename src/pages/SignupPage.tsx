import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { APP_NAME } from "../lib/labels";

type Errors = Partial<Record<"email" | "username" | "password" | "nickname" | "form", string>>;

// 백엔드 SignupRequestDto 검증 규칙과 맞춤
function validate(v: { email: string; username: string; password: string; nickname: string }): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "이메일 형식이 올바르지 않아요.";
  if (!v.username.trim()) e.username = "아이디를 입력해 주세요.";
  else if (v.username.trim().length < 4 || v.username.trim().length > 10) e.username = "아이디는 4~10자로 정해 주세요.";
  if (v.password.length < 8) e.password = "비밀번호는 8자 이상이어야 해요.";
  if (v.nickname.trim().length > 10) e.nickname = "닉네임은 10자 이내로 정해 주세요.";
  return e;
}

export function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";
  const [values, setValues] = useState({ email: "", username: "", password: "", nickname: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={next} replace />;

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      await signup({
        email: values.email.trim(),
        username: values.username.trim(),
        password: values.password,
        nickname: values.nickname.trim() || undefined,
      });
      navigate(next, { replace: true });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "가입하지 못했어요." });
    } finally {
      setBusy(false);
    }
  };

  const field = (k: keyof typeof values, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, hint?: string) => (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="input" value={values[k]} onChange={set(k)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] ? <span className="field-error">{errors[k]}</span> : hint && <span className="field-hint">{hint}</span>}
    </label>
  );

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <p className="wordmark">{APP_NAME}</p>
        <h1 className="auth-title">내 옷장부터<br />만들어 볼까요</h1>
      </div>
      <form className="form" onSubmit={submit} noValidate>
        {field("email", "이메일", { type: "email", autoComplete: "email", autoCapitalize: "none" })}
        {field("username", "아이디", { autoComplete: "username", autoCapitalize: "none", maxLength: 10 }, "4~10자")}
        {field("password", "비밀번호", { type: "password", autoComplete: "new-password" }, "8자 이상")}
        {field("nickname", "닉네임 (선택)", { maxLength: 10 }, "비워두면 아이디가 닉네임이 돼요")}
        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "가입 중…" : "가입하기"}
        </button>
        <p className="auth-switch">
          이미 계정이 있다면 <Link to={`/login?next=${encodeURIComponent(next)}`}>로그인</Link>
        </p>
      </form>
    </div>
  );
}
