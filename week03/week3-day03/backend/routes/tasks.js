const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { protect } = require("../middleware/auth");

const router = express.Router();

// In-memory tasks store
const tasks = [];

// All routes below require authentication
router.use(protect);

// @route  GET /api/tasks
router.get("/", (req, res) => {
  const userTasks = tasks.filter((t) => t.userId === req.user.id);
  res.json(userTasks);
});

// @route  POST /api/tasks
router.post("/", (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const task = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    description: description || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

// @route  PUT /api/tasks/:id
router.put("/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id && t.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, description, completed } = req.body;
  tasks[index] = {
    ...tasks[index],
    title: title !== undefined ? title : tasks[index].title,
    description: description !== undefined ? description : tasks[index].description,
    completed: completed !== undefined ? completed : tasks[index].completed,
  };

  res.json(tasks[index]);
});

// @route  DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id && t.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;
