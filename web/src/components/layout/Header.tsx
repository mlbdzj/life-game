import type { User } from "../../types/auth";

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  user: User;
  onLogout: () => void;
}

export function Header({ title, onToggleSidebar, user, onLogout }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="切换侧栏"
          className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
        >
          ☰
        </button>
        <h1 className="m-0 text-base font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
            {user.displayName.charAt(0)}
          </span>
          <span className="text-sm text-gray-700">{user.displayName}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-gray-900 transition-colors hover:bg-gray-100"
        >
          退出登录
        </button>
      </div>
    </header>
  );
}