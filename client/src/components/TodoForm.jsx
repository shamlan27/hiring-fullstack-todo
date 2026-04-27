import { useState, useRef } from "react";

const MAX_TITLE = 200;
const MAX_DESC = 1000;

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const titleRef = useRef(null);

  function validate() {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    else if (title.trim().length > MAX_TITLE) e.title = `Title must be ${MAX_TITLE} characters or fewer.`;
    if (description.length > MAX_DESC) e.description = `Description must be ${MAX_DESC} characters or fewer.`;
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      // Shake the form field with an error
      titleRef.current?.classList.add("shake");
      setTimeout(() => titleRef.current?.classList.remove("shake"), 400);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onAdd({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      titleRef.current?.focus();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add todo. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form} className="animate-in">
      <div style={styles.headingRow}>
        <div>
          <h2 style={styles.heading}>Add a new task</h2>
          <p style={styles.helper}>Capture what matters, then move on with a clearer head.</p>
        </div>
        <div style={styles.badge}>Quick add</div>
      </div>

      {apiError && <p style={styles.apiError}>{apiError}</p>}

      <div style={styles.field}>
        <label htmlFor="title" style={styles.label}>
          Title <span style={styles.required}>*</span>
        </label>
        <input
          id="title"
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: "" })); }}
          placeholder="What needs to be done?"
          style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
          disabled={submitting}
          autoFocus
        />
        {errors.title && <p style={styles.errorMsg}>{errors.title}</p>}
        <p style={styles.charCount}>{title.length}/{MAX_TITLE}</p>
      </div>

      <div style={styles.field}>
        <label htmlFor="description" style={styles.label}>
          Description <span style={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: "" })); }}
          placeholder="Add more details..."
          rows={3}
          style={{ ...styles.input, ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
          disabled={submitting}
        />
        {errors.description && <p style={styles.errorMsg}>{errors.description}</p>}
        <p style={styles.charCount}>{description.length}/{MAX_DESC}</p>
      </div>

      <button type="submit" style={styles.button} disabled={submitting}>
        {submitting ? <span className="spinner" /> : "+ Add Task"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: "var(--color-panel-bg)",
    border: "1px solid var(--color-panel-border)",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "var(--color-panel-shadow)",
    marginBottom: "18px",
  },
  headingRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--color-text)",
    letterSpacing: "-0.02em",
  },
  helper: {
    marginTop: "4px",
    fontSize: "13px",
    color: "var(--color-text-muted)",
    maxWidth: "42ch",
  },
  badge: {
    flexShrink: 0,
    padding: "7px 11px",
    borderRadius: "999px",
    border: "1px solid var(--color-chip-border)",
    background: "var(--color-chip-bg)",
    color: "var(--color-primary)",
    fontSize: "12px",
    fontWeight: 700,
  },
  field: {
    marginBottom: "14px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "6px",
    color: "var(--color-text)",
  },
  required: {
    color: "var(--color-danger)",
    marginLeft: "2px",
  },
  optional: {
    color: "var(--color-text-muted)",
    fontWeight: 400,
    fontSize: "12px",
    marginLeft: "4px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid var(--color-border)",
    borderRadius: "14px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "var(--color-text)",
    background: "var(--color-input-bg)",
    outline: "none",
    transition: "border-color var(--transition), box-shadow var(--transition), transform var(--transition), background var(--transition)",
  },
  textarea: {
    resize: "vertical",
    minHeight: "92px",
  },
  inputError: {
    borderColor: "var(--color-danger)",
    background: "var(--color-danger-light)",
  },
  errorMsg: {
    color: "var(--color-danger)",
    fontSize: "12px",
    marginTop: "4px",
  },
  charCount: {
    color: "var(--color-text-muted)",
    fontSize: "11px",
    textAlign: "right",
    marginTop: "3px",
  },
  button: {
    marginTop: "6px",
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "transform var(--transition), box-shadow var(--transition), filter var(--transition)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    minHeight: "40px",
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.22)",
  },
  apiError: {
    background: "var(--color-error-surface)",
    color: "var(--color-danger)",
    border: "1px solid #fca5a5",
    borderRadius: "14px",
    padding: "10px 12px",
    fontSize: "13px",
    marginBottom: "14px",
  },
};
