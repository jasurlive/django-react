import { useTheme } from "../hooks/LOCAL/useTheme";
import { THEME_LABELS } from "../lib/themes";
import { THEME_ICONS } from "../shared/ThemeIcons";

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="page-container">
      <h1 className="page-title">Settings</h1>

      <h2 className="page-subtitle">Theme</h2>
      <div className="theme-picker" role="radiogroup" aria-label="Theme">
        {themes.map((t) => (
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
      <p className="page-text">Tip: Ctrl+J cycles through themes.</p>
    </div>
  );
}
