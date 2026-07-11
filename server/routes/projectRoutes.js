const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all projects for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Create project
router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Update project
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
});

// Delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({
      project: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Project and related tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

module.exports = router;