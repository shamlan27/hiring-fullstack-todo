const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// GET /api/todos — fetch all todos, newest first
router.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// POST /api/todos — create a new todo
router.post("/", async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({ title: title.trim(), description: description?.trim() || "" });
    res.status(201).json(todo);
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    next(err);
  }
});

// PUT /api/todos/:id — update title and/or description
router.put("/:id", async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    next(err);
  }
});

// PATCH /api/todos/:id/done — toggle done status
router.patch("/:id/done", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.done = !todo.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    next(err);
  }
});

// DELETE /api/todos/:id — remove a todo
router.delete("/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully", id: req.params.id });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid todo ID" });
    }
    next(err);
  }
});

module.exports = router;
