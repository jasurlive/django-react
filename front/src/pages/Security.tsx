import { useGetDemo, type DemoComment } from "../hooks/GET/useGetDemo";
import { EmptyState, ErrorState, Skeleton } from "../shared/States";

// case: FEED + EMPTY + ERROR side by side
//  - activity log: a timeline of events
//  - alerts: a section with nothing in it
//  - sessions: a request that fails (wrong URL on purpose) to show the error box + retry
// demo data from jsonplaceholder, swap useGetDemo for real hooks
export default function Security() {
  const log = useGetDemo<DemoComment[]>("/comments?_limit=8");
  const sessions = useGetDemo<unknown[]>("/sessions-does-not-exist");

  return (
    <div className="page-container">
      <h1 className="page-title page-head">Security</h1>

      <div className="ui-columns">
        <section>
          <h2 className="page-subtitle">Activity log</h2>
          {log.loading && <Skeleton rows={8} height="2.5rem" />}
          {log.error && <ErrorState message={log.error} onRetry={log.retry} />}
          <ol className="ui-feed">
            {log.data?.map((c) => (
              <li key={c.id} className="ui-feed-item">
                <p className="ui-feed-title">{c.name}</p>
                <p className="ui-muted">{c.email}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="page-subtitle">Alerts</h2>
          <EmptyState title="No active alerts" text="You'll see suspicious logins and failed attempts here." />

          <h2 className="page-subtitle">Active sessions</h2>
          {sessions.loading && <Skeleton rows={2} height="2.5rem" />}
          {sessions.error && <ErrorState message={sessions.error} onRetry={sessions.retry} />}
        </section>
      </div>
    </div>
  );
}
