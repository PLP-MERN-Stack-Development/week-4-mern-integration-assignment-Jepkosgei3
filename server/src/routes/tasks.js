const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
require('dotenv').config();

// Middleware to verify JWT and extract user
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains email
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Create task request body:', req.body);
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Find user by email from token
    const User = require('../models/User');
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = new Task({
      title,
      description: description || '',
      status: status || 'pending',
      userId: user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ userId: user._id });
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;