import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import type { NavItem } from "./types/layout";

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "概览" },
  { id: "orders", label: "订单" },
  { id: "settings", label: "设置" },
];

export default function App() {
  const [activeId, setActiveId] = useState("dashboard");

  const current = NAV_ITEMS.find((item) => item.id === activeId);

  return (
    <AppLayout
      title="我的后台"
      navItems={NAV_ITEMS}
      activeId={activeId}
      onSelectNav={setActiveId}
    >
      <h2 className="mt-0 mb-2 text-xl font-semibold text-gray-900">
        {current?.label}
      </h2>
      <p className="text-sm text-gray-600">
        这里是「{current?.label}」的内容区。
      </p>
    </AppLayout>
  );
}