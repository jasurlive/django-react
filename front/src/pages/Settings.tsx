import { Link } from "react-router";
import { FiInfo, FiMaximize, FiMinimize } from "react-icons/fi";
import { useTheme } from "../hooks/LOCAL/useTheme";
import { useFullscreen } from "../hooks/LOCAL/useFullscreen";
import { THEME_LABELS } from "../lib/themes";
import { THEME_ICONS } from "../shared/ThemeIcons";

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();
  const { fullscreen, toggleFullscreen, supported } = useFullscreen();

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

      <h2 className="page-subtitle">Display</h2>
      {supported ? (
        <button
          type="button"
          aria-pressed={fullscreen}
          className={`page-button theme-option ${fullscreen ? "is-active" : ""}`}
          onClick={toggleFullscreen}
        >
          {fullscreen ? <FiMinimize /> : <FiMaximize />}
          {fullscreen ? "Exit fullscreen" : "Fullscreen"}
        </button>
      ) : (
        <p className="page-text">Fullscreen isn't supported in this browser.</p>
      )}

      {/* Info isn't in the phone menu bar, so link it here */}
      <h2 className="page-subtitle">About</h2>
      <Link to="/info" className="page-button theme-option">
        <FiInfo />
        Shortcuts, tips & feedback
      </Link>
    </div>
  );
}
