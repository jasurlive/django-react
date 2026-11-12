import { useGetDemo, type DemoTodo } from "../hooks/GET/useGetDemo";
import { ErrorState, Skeleton } from "../shared/States";

// case: STATS + CHART. numbers computed from a list, shown as tiles and a plain CSS bar chart
// demo data from jsonplaceholder, swap useGetDemo for a real hook
export default function Analytics() {
  const { data: todos, loading, error, retry } = useGetDemo<DemoTodo[]>("/todos");

  // done tasks per user -> { userId, done }
  const perUser = new Map<number, number>();
  todos?.forEach((t) => perUser.set(t.userId, (perUser.get(t.userId) ?? 0) + (t.completed ? 1 : 0)));
  const bars = [...perUser].map(([userId, done]) => ({ userId, done }));
  const max = Math.max(1, ...bars.map((b) => b.done));

  const total = todos?.length ?? 0;
  const done = todos?.filter((t) => t.completed).length ?? 0;
  const stats = [
    { label: "Tasks", value: total },
    { label: "Completed", value: done },
    { label: "Open", value: total - done },
    { label: "Done rate", value: total ? `${Math.round((done / total) * 100)}%` : "–" },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title page-head">Analytics</h1>

      {error && <ErrorState message={error} onRetry={retry} />}

      {!error && (
        <>
          <div className="ui-stats">
            {stats.map((s) => (
              <div key={s.label} className="ui-card">
                <p className="ui-muted">{s.label}</p>
                {loading ? <Skeleton rows={1} height="1.75rem" /> : <p className="ui-stat-value">{s.value}</p>}
              </div>
            ))}
          </div>

          <h2 className="page-subtitle">Completed tasks per user</h2>
          <div className="ui-card">
            {loading ? (
              <Skeleton rows={10} />
            ) : (
              <ul className="ui-bars">
                {bars.map((b) => (
                  <li key={b.userId} className="ui-bar-row">
                    <span className="ui-muted">User {b.userId}</span>
                    <span className="ui-bar-track">
                      <span className="ui-bar-fill" style={{ width: `${(b.done / max) * 100}%` }} />
                    </span>
                    <span className="ui-bar-value">{b.done}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
