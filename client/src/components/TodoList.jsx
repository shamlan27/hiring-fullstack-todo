import { useState } from "react";
import TodoItem from "./TodoItem";

const FILTERS = ["All", "Active", "Done"];

export default function TodoList({ todos, loading, error, onToggle, onEdit, onDelete, onReload }) {
  const [filter, setFilter] = useState("All");

  if (loading) {
    return (
      <div style={styles.center}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        <p style={styles.loadingText}>Loading todos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <p style={styles.errorText}>⚠️ {error}</p>
        <button onClick={onReload} style={styles.retryBtn}>Retry</button>
      </div>
    );
  }

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Done") return t.done;
    return true;
  });

  const doneCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="animate-in">
      {/* Stats + filter bar */}
      <div style={styles.toolbarCard}>
        <div style={styles.toolbar}>
          <div>
            <p style={styles.statsLabel}>Task progress</p>
            <p style={styles.stats}>
              {totalCount === 0
                ? "No tasks yet"
                : `${doneCount} of ${totalCount} completed`}
            </p>
          </div>
          <div style={styles.miniSummary}>
            <span style={styles.miniSummaryLabel}>{filter}</span>
            <span style={styles.miniSummaryValue}>{filtered.length}</span>
          </div>
        </div>
        <div style={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${(doneCount / totalCount) * 100}%`,
              transition: "width 400ms ease",
            }}
          />
        </div>
      )}

      {/* List */}
      <div style={{ marginTop: "16px" }}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>
            {filter === "All"
              ? "✨ Add your first task above!"
              : `No ${filter.toLowerCase()} tasks.`}
          </div>
        ) : (
          filtered.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "56px 0 48px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,250,252,0.9))",
    border: "1px dashed rgba(226,232,240,0.9)",
    borderRadius: "18px",
  },
  loadingText: {
    color: "var(--color-text-muted)",
    fontSize: "14px",
  },
  errorBox: {
    background: "var(--color-error-surface)",
    border: "1px solid #fca5a5",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "var(--color-panel-shadow)",
  },
  errorText: {
    color: "var(--color-danger)",
    fontSize: "14px",
    marginBottom: "12px",
  },
  retryBtn: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, var(--color-danger), var(--color-danger-hover))",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 10px 18px rgba(239, 68, 68, 0.18)",
  },
  toolbarCard: {
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid var(--color-panel-border)",
    background: "var(--color-panel-bg)",
    boxShadow: "var(--color-panel-shadow)",
    marginBottom: "12px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
  },
  statsLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--color-text-muted)",
    marginBottom: "2px",
  },
  stats: {
    fontSize: "14px",
    color: "var(--color-text)",
    fontWeight: 700,
  },
  miniSummary: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.12)",
  },
  miniSummaryLabel: {
    fontSize: "12px",
    color: "var(--color-text-muted)",
  },
  miniSummaryValue: {
    minWidth: "22px",
    height: "22px",
    padding: "0 7px",
    borderRadius: "999px",
    background: "var(--color-primary)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 14px",
    background: "var(--color-chip-bg)",
    border: "1px solid var(--color-border)",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    color: "var(--color-text-muted)",
    fontFamily: "inherit",
    transition: "transform var(--transition), border-color var(--transition), background var(--transition), color var(--transition), box-shadow var(--transition)",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.08))",
    borderColor: "rgba(99,102,241,0.35)",
    color: "var(--color-primary)",
    boxShadow: "0 10px 18px rgba(99, 102, 241, 0.08)",
  },
  progressTrack: {
    height: "8px",
    background: "var(--color-border)",
    borderRadius: "999px",
    overflow: "hidden",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.05)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #34d399)",
    borderRadius: "999px",
  },
  empty: {
    textAlign: "center",
    color: "var(--color-text-muted)",
    fontSize: "14px",
    padding: "44px 16px",
    borderRadius: "18px",
    background: "var(--color-empty-bg)",
    border: "1px dashed rgba(203, 213, 225, 0.95)",
  },
};
