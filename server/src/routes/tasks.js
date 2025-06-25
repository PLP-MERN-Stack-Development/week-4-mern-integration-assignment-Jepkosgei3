const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      user: req.user.id
    });

    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get a single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if task belongs to current user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if task belongs to current user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, dueDate, priority, status } = req.body;
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if task belongs to current user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await task.remove();
    res.json({ success: true, message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;