import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { NAV_ITEMS } from "../../config/nav";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  title?: string;
}

export function AppLayout({ title = "我的后台" }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // RequireAuth 已保证登录，这里仅用于收窄类型
  if (!user) return null;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header
        title={title}
        onToggleSidebar={() => setCollapsed((value) => !value)}
        user={user}
        onLogout={logout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={NAV_ITEMS} collapsed={collapsed} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      <footer className="flex h-10 shrink-0 items-center justify-center border-t border-gray-200 bg-white text-[13px] text-gray-400">
        © 2026 My App
      </footer>
    </div>
  );
}
