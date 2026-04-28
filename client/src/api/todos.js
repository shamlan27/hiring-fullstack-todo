import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const fetchTodos = () =>
  api.get("/todos").then((r) => r.data);

export const createTodo = (data) =>
  api.post("/todos", data).then((r) => r.data);

export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data).then((r) => r.data);

export const toggleDone = (id) =>
  api.patch(`/todos/${id}/done`).then((r) => r.data);

export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`).then((r) => r.data);
