import type { NavItem } from "../../types/layout";

interface SidebarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 overflow-auto border-r border-gray-200 bg-white p-3">
      <nav>
        <ul className="m-0 list-none p-0">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={
                    "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
                    (isActive
                      ? "bg-blue-50 font-medium text-blue-600"
                      : "text-gray-900 hover:bg-gray-100")
                  }
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}