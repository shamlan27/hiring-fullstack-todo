import { useState, useRef, useEffect } from "react";

const MAX_TITLE = 200;
const MAX_DESC = 1000;

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [actionError, setActionError] = useState("");
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editing) titleInputRef.current?.focus();
  }, [editing]);

  // Keep local state in sync if parent optimistically updates
  useEffect(() => {
    if (!editing) {
      setTitle(todo.title);
      setDescription(todo.description || "");
    }
  }, [todo.title, todo.description, editing]);

  function validateEdit() {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    else if (title.trim().length > MAX_TITLE) e.title = `Max ${MAX_TITLE} characters.`;
    if (description.length > MAX_DESC) e.description = `Max ${MAX_DESC} characters.`;
    return e;
  }

  async function handleSave() {
    const errs = validateEdit();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setActionError("");
    try {
      await onEdit(todo._id, { title: title.trim(), description: description.trim() });
      setEditing(false);
      setErrors({});
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setErrors({});
    setActionError("");
    setEditing(false);
  }

  async function handleToggle() {
    setToggling(true);
    setActionError("");
    try {
      await onToggle(todo._id);
    } catch {
      setActionError("Failed to update status.");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;
    setRemoving(true);
    try {
      await onDelete(todo._id);
    } catch {
      setRemoving(false);
      setActionError("Failed to delete todo.");
    }
  }

  const isPending = !!todo._pending;

  return (
    <div
      className="animate-in"
      style={{
        ...styles.card,
        opacity: isPending ? 0.6 : 1,
        ...(todo.done ? styles.cardDone : {}),
      }}
    >
      {actionError && <p style={styles.actionError}>{actionError}</p>}

      {editing ? (
        <div style={styles.editArea}>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
            style={{ ...styles.editInput, ...(errors.title ? styles.editInputError : {}) }}
          />
          {errors.title && <p style={styles.errorMsg}>{errors.title}</p>}

          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
            rows={3}
            placeholder="Description (optional)"
            style={{ ...styles.editInput, ...styles.editTextarea, ...(errors.description ? styles.editInputError : {}) }}
          />
          {errors.description && <p style={styles.errorMsg}>{errors.description}</p>}

          <div style={styles.editActions}>
            <button onClick={handleSave} disabled={saving} style={styles.btnSave}>
              {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : "Save"}
            </button>
            <button onClick={handleCancelEdit} disabled={saving} style={styles.btnCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.viewArea}>
          <button
            onClick={handleToggle}
            disabled={toggling || isPending}
            style={{ ...styles.checkbox, ...(todo.done ? styles.checkboxDone : {}) }}
            title={todo.done ? "Mark as undone" : "Mark as done"}
            aria-label={todo.done ? "Mark as undone" : "Mark as done"}
          >
            {todo.done && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div style={styles.content}>
            <p style={{ ...styles.title, ...(todo.done ? styles.titleDone : {}) }}>
              {todo.title}
              {isPending && <span style={styles.pendingBadge}>saving…</span>}
            </p>
            {todo.description && (
              <p style={{ ...styles.desc, ...(todo.done ? styles.descDone : {}) }}>
                {todo.description}
              </p>
            )}
          </div>

          <div style={styles.actions}>
            <button
              onClick={() => { setEditing(true); setActionError(""); }}
              disabled={isPending}
              style={styles.btnIcon}
              title="Edit"
              aria-label="Edit todo"
            >
              <PencilIcon />
            </button>
            <button
              onClick={handleDelete}
              disabled={removing || isPending}
              style={{ ...styles.btnIcon, ...styles.btnDelete }}
              title="Delete"
              aria-label="Delete todo"
            >
              {removing ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <TrashIcon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h11M5 4V2.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5V4M6 7v4M9 7v4M3 4l.8 8.2a1 1 0 001 .8h5.4a1 1 0 001-.8L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const styles = {
  card: {
    background: "var(--color-card-bg)",
    border: "1px solid var(--color-panel-border)",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "var(--color-card-shadow)",
    transition: "box-shadow var(--transition), border-color var(--transition), transform var(--transition)",
  },
  cardDone: {
    background: "var(--color-card-done-bg)",
    borderColor: "var(--color-panel-border)",
  },
  viewArea: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },
  checkbox: {
    flexShrink: 0,
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "2px solid var(--color-border)",
    background: "var(--color-surface)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color var(--transition), background var(--transition), transform var(--transition), box-shadow var(--transition)",
    marginTop: "1px",
  },
  checkboxDone: {
    background: "linear-gradient(135deg, var(--color-success), #16a34a)",
    borderColor: "var(--color-success)",
    boxShadow: "0 8px 14px rgba(34, 197, 94, 0.22)",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--color-text)",
    wordBreak: "break-word",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  titleDone: {
    textDecoration: "line-through",
    color: "var(--color-done-text)",
  },
  desc: {
    fontSize: "13px",
    color: "var(--color-text-muted)",
    marginTop: "6px",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    lineHeight: 1.55,
  },
  descDone: {
    color: "#cbd5e1",
  },
  actions: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
  },
  btnIcon: {
    background: "var(--color-chip-bg)",
    border: "1px solid var(--color-chip-border)",
    padding: "7px",
    cursor: "pointer",
    color: "var(--color-text-muted)",
    borderRadius: "12px",
    transition: "color var(--transition), background var(--transition), border-color var(--transition), transform var(--transition), box-shadow var(--transition)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDelete: {
    color: "var(--color-danger)",
  },
  editArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "2px",
  },
  editInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "var(--color-text)",
    background: "var(--color-input-bg)",
    outline: "none",
    transition: "border-color var(--transition), box-shadow var(--transition), transform var(--transition)",
  },
  editTextarea: {
    resize: "vertical",
    minHeight: "84px",
  },
  editInputError: {
    borderColor: "var(--color-danger)",
  },
  editActions: {
    display: "flex",
    gap: "10px",
  },
  btnSave: {
    padding: "9px 16px",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "70px",
    minHeight: "32px",
    boxShadow: "0 10px 18px rgba(79, 70, 229, 0.18)",
  },
  btnCancel: {
    padding: "9px 16px",
    background: "var(--color-chip-bg)",
    color: "var(--color-text-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    fontSize: "13px",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  errorMsg: {
    color: "var(--color-danger)",
    fontSize: "12px",
  },
  actionError: {
    color: "var(--color-danger)",
    fontSize: "12px",
    marginBottom: "8px",
    background: "var(--color-error-surface)",
    padding: "6px 10px",
    borderRadius: "12px",
  },
  pendingBadge: {
    fontSize: "11px",
    color: "var(--color-text-muted)",
    fontWeight: 400,
    background: "var(--color-chip-bg)",
    padding: "2px 7px",
    borderRadius: "999px",
  },
};
