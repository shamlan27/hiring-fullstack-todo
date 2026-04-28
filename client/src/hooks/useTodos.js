import { useState, useEffect, useCallback } from "react";
import * as api from "../api/todos";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTodos();
      setTodos(data);
    } catch {
      setError("Failed to load todos. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Create ─────────────────────────────────────────────────────────────────
  const addTodo = useCallback(async ({ title, description }) => {
    // Optimistic — add a temporary placeholder
    const temp = {
      _id: `temp-${Date.now()}`,
      title,
      description,
      done: false,
      createdAt: new Date().toISOString(),
      _pending: true,
    };
    setTodos((prev) => [temp, ...prev]);

    try {
      const created = await api.createTodo({ title, description });
      setTodos((prev) => prev.map((t) => (t._id === temp._id ? created : t)));
    } catch (err) {
      // Roll back
      setTodos((prev) => prev.filter((t) => t._id !== temp._id));
      throw err;
    }
  }, []);

  // ── Update ─────────────────────────────────────────────────────────────────
  const editTodo = useCallback(async (id, { title, description }) => {
    const prev = todos.find((t) => t._id === id);
    // Optimistic
    setTodos((ts) => ts.map((t) => (t._id === id ? { ...t, title, description } : t)));

    try {
      const updated = await api.updateTodo(id, { title, description });
      setTodos((ts) => ts.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      // Roll back
      setTodos((ts) => ts.map((t) => (t._id === id ? prev : t)));
      throw err;
    }
  }, [todos]);

  // ── Toggle done ────────────────────────────────────────────────────────────
  const toggleTodo = useCallback(async (id) => {
    // Optimistic toggle
    setTodos((ts) =>
      ts.map((t) => (t._id === id ? { ...t, done: !t.done } : t))
    );

    try {
      const updated = await api.toggleDone(id);
      setTodos((ts) => ts.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      // Roll back
      setTodos((ts) =>
        ts.map((t) => (t._id === id ? { ...t, done: !t.done } : t))
      );
      throw err;
    }
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const removeTodo = useCallback(async (id) => {
    const snapshot = todos.find((t) => t._id === id);
    // Optimistic remove
    setTodos((ts) => ts.filter((t) => t._id !== id));

    try {
      await api.deleteTodo(id);
    } catch (err) {
      // Roll back
      setTodos((ts) => [snapshot, ...ts]);
      throw err;
    }
  }, [todos]);

  return { todos, loading, error, addTodo, editTodo, toggleTodo, removeTodo, reload: load };
}
