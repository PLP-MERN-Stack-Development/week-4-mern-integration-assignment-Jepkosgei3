const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).populate('category');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('category');
    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  [body('title').notEmpty().withMessage('Title is required'), body('dueDate').optional().isISO8601().withMessage('Invalid date')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const task = new Task({ ...req.body, user: req.user._id });
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  authMiddleware,
  [body('title').notEmpty().withMessage('Title is required'), body('dueDate').optional().isISO8601().withMessage('Invalid date')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const task = await Task.findById(req.params.id);
      if (!task || task.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      Object.assign(task, req.body);
      await task.save();
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/attachments', authMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    task.attachments.push(req.file.path);
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/comments', authMiddleware, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    task.comments.push({ user: req.user._id, text: req.body.text });
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

module.exports = router;