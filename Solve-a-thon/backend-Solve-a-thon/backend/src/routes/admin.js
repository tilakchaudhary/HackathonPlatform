// src/routes/admin.js
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// Only admin can use these routes
router.use(auth, requireRole('admin'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role required' });
    const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
