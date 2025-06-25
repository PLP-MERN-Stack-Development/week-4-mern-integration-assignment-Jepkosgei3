const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authMiddleware,
  [body('name').notEmpty().withMessage('Category name is required')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const category = new Category({ name: req.body.name, user: req.user._id });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;