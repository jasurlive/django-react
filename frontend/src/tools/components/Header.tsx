export default function Header() {
    return (
      <header className="home-menu">
        <h1 className="home-title">{import.meta.env.VITE_APP_TITLE}</h1>
      </header>
    );
  }