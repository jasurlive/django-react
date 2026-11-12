import { useGetDemo, type DemoPost } from "../hooks/GET/useGetDemo";
import { EmptyState, ErrorState, Skeleton } from "../shared/States";

// case: CARD GRID. one card per record, columns adapt to screen width
// demo data from jsonplaceholder, swap useGetDemo for a real hook
export default function Reports() {
  const { data: posts, loading, error, retry } = useGetDemo<DemoPost[]>("/posts?_limit=12");

  return (
    <div className="page-container">
      <h1 className="page-title page-head">Reports</h1>

      {error && <ErrorState message={error} onRetry={retry} />}
      {posts?.length === 0 && <EmptyState title="No reports yet" />}

      <div className="ui-grid">
        {loading &&
          Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="ui-card">
              <Skeleton rows={3} />
            </div>
          ))}

        {posts?.map((p) => (
          <article key={p.id} className="ui-card">
            <span className="ui-badge">#{p.id}</span>
            <h2 className="ui-card-title">{p.title}</h2>
            <p className="ui-card-text">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
