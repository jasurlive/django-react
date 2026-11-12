import "../css/home.css";
import Header from "../components/Header";
import { useGetDemo, type DemoUser } from "../hooks/GET/useGetDemo";

// demo data from jsonplaceholder, so the template works without the backend
// to use your Django API instead: swap useGetDemo for useGetUsers (hooks/GET/useGetUsers.ts)
export default function Home() {
  const { data: users, loading, error } = useGetDemo<DemoUser[]>("/users");

  return (
    <div className="home-container">
      <Header />

      <main className="home-content">
        {/* empty boxes: replace with real widgets (stats, charts, lists) */}
        <div className="home-boxes">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="home-box" />
          ))}
        </div>

        {loading && <p className="home-status">Loading users…</p>}
        {error && <p className="home-status home-error">Couldn't load users: {error}</p>}

        <ul className="home-list">
          {users?.map((user) => (
            <li key={user.id} className="home-item">
              <span className="home-name">{user.name}</span>
              <span className="home-email">{user.email}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
