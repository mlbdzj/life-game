import { NavLink } from "react-router-dom";
import type { NavItem } from "../../types/layout";

interface SidebarProps {
  items: NavItem[];
  collapsed: boolean;
}

export function Sidebar({ items, collapsed }: SidebarProps) {
  return (
    <aside
      className={
        "shrink-0 overflow-auto border-r border-gray-200 bg-white p-3 transition-[width] duration-200 " +
        (collapsed ? "w-16" : "w-60")
      }
    >
      <nav>
        <ul className="m-0 list-none p-0">
          {items.map((item) => (
            <li key={item.id} className="mb-1">
              <NavLink
                to={item.path}
                end={item.path === "/"}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  "block rounded-md py-2 text-sm transition-colors " +
                  (collapsed ? "px-2 text-center " : "px-3 text-left ") +
                  (isActive
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-900 hover:bg-gray-100")
                }
              >
                {collapsed ? item.label.charAt(0) : item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
