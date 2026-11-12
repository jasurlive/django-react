import { useState } from "react";
import { useGetDemo, type DemoTodo } from "../hooks/GET/useGetDemo";
import { EmptyState, ErrorState, Skeleton } from "../shared/States";

// case: FILTER + PAGINATION. tabs narrow the list, pages split it; a filter can end up empty
// demo data from jsonplaceholder, swap useGetDemo for a real hook
const FILTERS = ["all", "open", "done"] as const;
type Filter = (typeof FILTERS)[number];
const PAGE_SIZE = 10;

export default function Database() {
  const { data: todos, loading, error, retry } = useGetDemo<DemoTodo[]>("/todos?userId=1");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const filtered = (todos ?? []).filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pickFilter = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="page-container">
      <h1 className="page-title page-head">Database</h1>

      <div className="ui-tabs" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={f === filter}
            className={`page-button ${f === filter ? "is-active" : ""}`}
            onClick={() => pickFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <Skeleton rows={PAGE_SIZE} height="2.25rem" />}
      {error && <ErrorState message={error} onRetry={retry} />}

      {todos && visible.length === 0 && (
        <EmptyState title={`No ${filter} records`} text="Try another filter.">
          <button type="button" className="page-button" onClick={() => pickFilter("all")}>
            Show all
          </button>
        </EmptyState>
      )}

      {visible.length > 0 && (
        <>
          <ul className="ui-list">
            {visible.map((t) => (
              <li key={t.id} className="ui-list-item">
                <span className={`ui-dot ${t.completed ? "is-done" : ""}`} aria-hidden />
                <span className="ui-grow">{t.title}</span>
                <span className="ui-badge">{t.completed ? "done" : "open"}</span>
              </li>
            ))}
          </ul>

          <div className="ui-pager">
            <button type="button" className="page-button" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span className="ui-muted">
              Page {page} of {pages}
            </span>
            <button type="button" className="page-button" disabled={page === pages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
