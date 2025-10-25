// src/routes/notification.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/authMiddleware');

// get logged-in user notifications
router.get('/me', auth, async (req, res) => {
  try {
    const notes = await Notification.find({ toUser: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
