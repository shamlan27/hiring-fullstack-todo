import { useLayoutEffect, useState } from "react";
import { useTodos } from "./hooks/useTodos";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const THEME_STORAGE_KEY = "todo-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const { todos, loading, error, addTodo, editTodo, toggleTodo, removeTodo, reload } = useTodos();
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const styles = createStyles();

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <div style={styles.page} className="animate-in">
      <div style={styles.glowTop} aria-hidden="true" />
      <div style={styles.glowBottom} aria-hidden="true" />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerMain}>
            <div style={styles.logoWrap} aria-hidden="true">
              <span style={styles.logo}>✅</span>
            </div>
            <div style={styles.headerCopy}>
              <p style={styles.kicker}>Personal task space</p>
              <h1 style={styles.title}>My Tasks</h1>
              <p style={styles.subtitle}>Keep the day calm, clear, and moving forward.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            style={styles.themeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span style={styles.themeIcon} aria-hidden="true">
              {theme === "dark" ? "☀️" : "🌙"}
            </span>
            <span style={styles.themeToggleText}>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </header>

        {/* Add form */}
        <TodoForm onAdd={addTodo} />

        {/* List */}
        <TodoList
          todos={todos}
          loading={loading}
          error={error}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={removeTodo}
          onReload={reload}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "var(--color-page-bg)",
    padding: "48px 16px 88px",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "760px",
    margin: "0 auto",
    padding: "24px",
    border: "1px solid var(--color-shell-border)",
    borderRadius: "24px",
    background: "var(--color-shell-bg)",
    backdropFilter: "blur(18px)",
    boxShadow: "var(--color-shell-shadow)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
    paddingBottom: "18px",
    borderBottom: "1px solid var(--color-shell-border)",
  },
  headerMain: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minWidth: 0,
  },
  logoWrap: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(34,197,94,0.16))",
    border: "1px solid rgba(99, 102, 241, 0.12)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
    flexShrink: 0,
  },
  logo: {
    fontSize: "30px",
    lineHeight: 1,
    filter: "drop-shadow(0 4px 14px rgba(99, 102, 241, 0.18))",
  },
  headerCopy: {
    minWidth: 0,
  },
  kicker: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--color-primary)",
    marginBottom: "4px",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 36px)",
    fontWeight: 800,
    color: "var(--color-text)",
    letterSpacing: "-0.04em",
    lineHeight: 1.05,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--color-text-muted)",
    marginTop: "6px",
    maxWidth: "48ch",
  },
  glowTop: {
    position: "absolute",
    top: "-140px",
    left: "-90px",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "var(--color-page-glow-top)",
    filter: "blur(70px)",
    animation: "floatGlow 14s ease-in-out infinite",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    right: "-120px",
    bottom: "-150px",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "var(--color-page-glow-bottom)",
    filter: "blur(80px)",
    animation: "floatGlow 16s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  themeToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid var(--color-chip-border)",
    background: "var(--color-chip-bg)",
    color: "var(--color-text)",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 700,
    boxShadow: "var(--color-chip-shadow)",
    transition: "transform var(--transition), box-shadow var(--transition), border-color var(--transition), background var(--transition)",
  },
  themeIcon: {
    fontSize: "14px",
    lineHeight: 1,
  },
  themeToggleText: {
    whiteSpace: "nowrap",
  },
};

function createStyles() {
  return styles;
}
