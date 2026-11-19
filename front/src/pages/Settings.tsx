import { FiMaximize, FiMinimize } from "react-icons/fi";
import { useTheme } from "../hooks/LOCAL/useTheme";
import { useFullscreen } from "../hooks/LOCAL/useFullscreen";
import { THEME_LABELS, isDarkTheme } from "../lib/themes";
import { THEME_ICONS } from "../shared/ThemeIcons";

// how to use the app: keep this in sync when you add shortcuts (see Menu.tsx) or features
const SHORTCUTS = [
  { keys: ["`"], action: "Collapse or expand the sidebar" },
  { keys: ["Ctrl", "J"], action: "Switch to the next theme" },
];

const TIPS = [
  "The arrow at the top of the sidebar (or the ` key) collapses or expands it. Your choice is remembered.",
  "Your theme is saved in this browser.",
  "Press Esc to leave fullscreen.",
  "On phones the menu is a bar at the bottom with the main pages. One slot rotates through extra pages: swipe it up or down to flip. The rest are on desktop.",
  "If a page breaks, it shows an error box. Reloading the page usually fixes it.",
];

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const { fullscreen, toggleFullscreen, supported } = useFullscreen();

  return (
    <div className="page-container">
      <h1 className="page-title">Settings</h1>

      <h2 className="page-subtitle">Theme</h2>
      {/* light themes on the left, dark on the right */}
      <div className="theme-columns" role="radiogroup" aria-label="Theme">
        {[
          { label: "Light", list: themes.filter((t) => !isDarkTheme(t)) },
          { label: "Dark", list: themes.filter(isDarkTheme) },
        ].map((col) => (
          <div key={col.label} className="theme-picker">
            <span className="theme-column-label">{col.label}</span>
            {col.list.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={t === theme}
                className={`page-button theme-option ${t === theme ? "is-active" : ""}`}
                onClick={() => setTheme(t)}
              >
                {THEME_ICONS[t]}
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        ))}
      </div>

      <h2 className="page-subtitle">Display</h2>
      {supported ? (
        <button
          type="button"
          role="switch"
          aria-checked={fullscreen}
          className="settings-switch"
          onClick={toggleFullscreen}
        >
          {fullscreen ? <FiMinimize /> : <FiMaximize />}
          <span>Fullscreen</span>
          <span className="settings-knob" />
        </button>
      ) : (
        <p className="page-text">Fullscreen isn't supported in this browser.</p>
      )}

      <h2 className="page-subtitle">Keyboard shortcuts</h2>
      <ul className="info-list">
        {SHORTCUTS.map((s) => (
          <li key={s.action}>
            <span>
              {s.keys.map((k) => (
                <kbd key={k}>{k}</kbd>
              ))}
            </span>
            {s.action}
          </li>
        ))}
      </ul>
      <p className="page-text">On Mac, use ⌘ instead of Ctrl. Shortcuts are ignored while typing in a field.</p>

      <h2 className="page-subtitle">Tips</h2>
      <ul className="info-list">
        {TIPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <p className="page-text info-footer">
        © 2026 Jasur · <a href="https://jasurlive.uz">jasurlive.uz</a> · Feedback:{" "}
        <a href="https://t.me/jasurlive_bot">@jasurlive_bot</a>
      </p>
    </div>
  );
}
