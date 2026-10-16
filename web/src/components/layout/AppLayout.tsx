import type { ReactNode } from "react";
import type { NavItem } from "../../types/layout";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  title: string;
  navItems: NavItem[];
  activeId: string;
  onSelectNav: (id: string) => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  children: ReactNode;
}

export function AppLayout({
  title,
  navItems,
  activeId,
  onSelectNav,
  sidebarCollapsed,
  onToggleSidebar,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header title={title} onToggleSidebar={onToggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          items={navItems}
          activeId={activeId}
          onSelect={onSelectNav}
          collapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      <footer className="flex h-10 shrink-0 items-center justify-center border-t border-gray-200 bg-white text-[13px] text-gray-400">
        © 2026 My App
      </footer>
    </div>
  );
}