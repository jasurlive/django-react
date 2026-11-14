// how to use the app: keep this in sync when you add shortcuts (see Menu.tsx) or features
const SHORTCUTS = [
  { keys: ["`"], action: "Collapse or expand the sidebar" },
  { keys: ["Ctrl", "J"], action: "Switch to the next theme" },
];

const TIPS = [
  "The arrow at the top of the sidebar (or the ` key) collapses or expands it. Your choice is remembered.",
  "Pick a theme in Settings. It's saved in this browser.",
  "Settings also has a fullscreen button. Press Esc to leave fullscreen.",
  "On phones the menu is a bar at the bottom with the main pages. One slot rotates through extra pages: swipe it up or down to flip. The rest are on desktop.",
  "If a page breaks, it shows an error box. Reloading the page usually fixes it.",
];

export default function Info() {
  return (
    <div className="page-container">
      <h1 className="page-title">Info</h1>

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

      <h2 className="page-subtitle">Using the app</h2>
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
