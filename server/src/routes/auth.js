const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { username, email, password } = req.body;
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      next(error);
    }
  }
);
router.post(
  '/login',
  [body('email').isEmail().withMessage('Invalid email'), body('password').notEmpty().withMessage('Password is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
      next(error);
    }
  }
);
// ... (login route remains unchanged)

module.exports = router;