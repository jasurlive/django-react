import "../css/home.css";
import { useGetUsers } from "../hooks/GET/useGetUsers";
import Header from "../components/Header";

export default function Home() {
  const { users, loading, error } = useGetUsers();

  return (
    <div className="home-container">
      <Header />

      <main className="home-content">
        {loading && <p className="home-status">Loading users…</p>}
        {error && (
          <p className="home-status home-error">
            Couldn't load users: {error}. Check VITE_API_URL in .env.
          </p>
        )}

        <ul className="home-list">
          {users.map((user) => (
            <li key={user.id} className="home-item">
              <span className="home-name">
                {user.firstname} {user.surname}
              </span>
              <span className="home-email">{user.username}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
