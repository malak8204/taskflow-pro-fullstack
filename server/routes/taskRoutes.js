const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;
    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required"
      });
    }

    const existingProject = await Project.findOne({
      _id: project,
      user: req.user.id
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
  title,
  description,
  status,
  priority,
  dueDate,
  project,
  user: req.user.id
});

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
