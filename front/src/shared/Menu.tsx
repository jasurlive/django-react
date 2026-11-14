import { useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiInfo,
  FiShield,
} from "react-icons/fi";
import "../css/menu.css";
import { useTheme } from "../hooks/LOCAL/useTheme";
import { useShortcuts } from "../hooks/LOCAL/useShortcuts";
import { useFlipMenu } from "../hooks/LOCAL/useFlipMenu";

export type MenuItem = {
  label: string;
  icon: ReactNode;
  href: string;
  mobile?: boolean; // shown in the phone bar
  flip?: boolean; // phones: flip items share one rotating slot (see useFlipMenu), keep them next to each other
  bottom?: boolean; // pinned to the bottom of the sidebar on desktop, keep these last
};

const ITEMS: MenuItem[] = [
  { label: "Home", icon: <FiHome />, href: "/", mobile: true },
  { label: "Users", icon: <FiUsers />, href: "/users", mobile: true },
  { label: "Analytics", icon: <FiBarChart2 />, href: "/analytics", mobile: true },
  { label: "Reports", icon: <FiFileText />, href: "/reports", mobile: true },
  { label: "Database", icon: <FiDatabase />, href: "/database", flip: true },
  { label: "Security", icon: <FiShield />, href: "/security", flip: true },
  { label: "Settings", icon: <FiSettings />, href: "/settings", mobile: true, bottom: true },
  { label: "Info", icon: <FiInfo />, href: "/info", bottom: true },
];

export default function Menu({ items = ITEMS }: { items?: MenuItem[] }) {
  const { toggleTheme } = useTheme();
  const flip = useFlipMenu(items.filter((i) => i.flip).map((i) => i.href));
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("menu-collapsed") !== "false"
  );

  const toggleMenu = () => {
    setCollapsed((value) => {
      localStorage.setItem("menu-collapsed", String(!value));
      return !value;
    });
  };

  // global shortcuts, listed on the Info page: keep both in sync
  useShortcuts({ "ctrl+j": toggleTheme, "`": toggleMenu });

  return (
    <nav className={`menu ${collapsed ? "menu-collapsed" : ""}`}>
      <button
        type="button"
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label="Toggle sidebar (`)"
        title="Toggle sidebar (`)"
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {items.map((item) => {
        const mobile = item.flip ? flip.isShowing(item.href) : item.mobile;
        const className = [
          "menu-item",
          mobile ? "menu-mobile-visible" : "menu-desktop-only",
          item.flip && flip.className,
          item.bottom && "menu-bottom",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          // NavLink adds .active on the current page; `end` so "/" isn't active everywhere
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={className}
            title={item.label}
            {...(item.flip && flip.bind(item.href))}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
