import "./PrintableView.css";

const STATUS_LABELS = {
  pending: "Pending",
  inprogress: "In Progress",
  done: "Done",
};

const STATUS_ORDER = ["pending", "inprogress", "done"];

/**
 * Renders nothing visible on screen. Only appears via the @media print
 * rules in PrintableView.css, which hide everything else on the page
 * (visibility:hidden trick) so this doesn't need to know anything about
 * the rest of the app's markup or CSS.
 */
const PrintableView = ({ todos }) => {
  const grouped = STATUS_ORDER.map((status) => ({
    status,
    tasks: todos.filter((t) => t.status === status),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="printable-tasks">
      <div className="printable-header">
        <h1>TodoFlow — Task List</h1>
        <p>Printed {new Date().toLocaleDateString(undefined, {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })}</p>
      </div>

      {grouped.length === 0 ? (
        <p className="printable-empty">No tasks match the current view.</p>
      ) : (
        grouped.map(({ status, tasks }) => (
          <div key={status} className="printable-group">
            <h2>{STATUS_LABELS[status]} ({tasks.length})</h2>
            <table className="printable-table">
              <tbody>
                {tasks.map((t) => (
                  <tr key={t._id}>
                    <td className="printable-checkbox">
                      <span className={status === "done" ? "printable-box printable-box--checked" : "printable-box"} />
                    </td>
                    <td className="printable-cell">
                      <div className="printable-title">
                        {t.title}
                        {t.star ? " ★" : ""}
                      </div>
                      {t.description && (
                        <div className="printable-desc">{t.description}</div>
                      )}
                      {t.link && (
                        <div className="printable-link">{t.link}</div>
                      )}
                    </td>
                    <td className="printable-due">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default PrintableView;