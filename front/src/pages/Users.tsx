import { useGetDemo, type DemoUser } from "../hooks/GET/useGetDemo";
import { EmptyState, ErrorState, Skeleton } from "../shared/States";

// case: TABLE. rows of records with several columns, scrolls sideways on phones
// demo data from jsonplaceholder, swap useGetDemo for a real hook (see hooks/GET/useGetUsers.ts)
export default function Users() {
  const { data: users, loading, error, retry } = useGetDemo<DemoUser[]>("/users");

  return (
    <div className="page-container">
      <div className="page-head">
        <h1 className="page-title">Users</h1>
        {users && <span className="ui-badge">{users.length} total</span>}
      </div>

      {loading && <Skeleton rows={6} height="2.25rem" />}
      {error && <ErrorState message={error} onRetry={retry} />}
      {users?.length === 0 && <EmptyState title="No users yet" />}

      {users && users.length > 0 && (
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="ui-avatar">{u.name[0]}</span>
                    {u.name}
                  </td>
                  <td className="ui-muted">{u.email}</td>
                  <td>{u.company.name}</td>
                  <td className="ui-muted">{u.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
