import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { User } from "../types/auth";

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

/** 本地演示账号，接入真实接口后删除 */
const DEMO_ACCOUNT = {
  username: "admin",
  password: "123456",
  displayName: "管理员",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError("");

    if (!username.trim() || !password) {
      setError("请输入用户名和密码");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: 替换为真实登录接口
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (
        username.trim() !== DEMO_ACCOUNT.username ||
        password !== DEMO_ACCOUNT.password
      ) {
        setError("用户名或密码不正确");
        return;
      }

      const nextUser: User = {
        username: DEMO_ACCOUNT.username,
        displayName: DEMO_ACCOUNT.displayName,
      };

      login(nextUser, remember);

      const from = (location.state as LoginLocationState | null)?.from;
      const redirectTo = from?.pathname
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : "/";
      navigate(redirectTo, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            L
          </div>
          <h1 className="m-0 text-2xl font-semibold text-gray-900">
            我的后台
          </h1>
          <p className="mt-2 text-sm text-gray-500">登录后继续</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={submitting}
              placeholder="请输入用户名"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
              placeholder="请输入密码"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={submitting}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600"
            />
            记住我
          </label>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? "登录中…" : "登录"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          演示账号：admin / 123456
        </p>
      </div>
    </div>
  );
}
