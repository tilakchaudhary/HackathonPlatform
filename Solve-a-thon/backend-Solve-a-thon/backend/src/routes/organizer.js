// src/routes/organizer.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Notification = require('../models/Notification');

// protect all organizer routes
router.use(auth, requireRole('organizer'));

// Create hackathon (multipart/form-data)
router.post('/hackathons', upload.fields([{ name: 'logo' }, { name: 'rules' }]), async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, rounds } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });

    const newHack = new Hackathon({
      title,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || 'Not Started',
      rounds: rounds ? (Array.isArray(rounds) ? rounds : rounds.split(',').map(r=>r.trim())) : [],
      organizer: req.user.id,
    });

    if (req.files?.logo?.[0]) newHack.logoUrl = `/uploads/${req.files.logo[0].filename}`;
    if (req.files?.rules?.[0]) newHack.rulesFileUrl = `/uploads/${req.files.rules[0].filename}`;

    await newHack.save();
    res.status(201).json(newHack);
  } catch (err) {
    console.error('Create hack err', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List hackathons for organizer
router.get('/hackathons', async (req, res) => {
  try {
    const hacks = await Hackathon.find({ organizer: req.user.id })
      .populate('participants', 'name email role')
      .populate('judges', 'name email role')
      .sort({ createdAt: -1 });
    res.json(hacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single hackathon (organizer-owned)
router.get('/hackathons/:id', async (req, res) => {
  try {
    const hack = await Hackathon.findById(req.params.id)
      .populate('participants', 'name email role')
      .populate('judges', 'name email role');
    if (!hack) return res.status(404).json({ message: 'Not found' });
    if (String(hack.organizer) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(hack);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update hackathon (with files allowed)
router.put('/hackathons/:id', upload.fields([{ name: 'logo' }, { name: 'rules' }]), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.logo?.[0]) updates.logoUrl = `/uploads/${req.files.logo[0].filename}`;
    if (req.files?.rules?.[0]) updates.rulesFileUrl = `/uploads/${req.files.rules[0].filename}`;
    if (updates.rounds && typeof updates.rounds === 'string') {
      updates.rounds = updates.rounds.split(',').map(r => r.trim());
    }
    const hack = await Hackathon.findById(req.params.id);
    if (!hack) return res.status(404).json({ message: 'Not found' });
    if (String(hack.organizer) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    Object.assign(hack, updates);
    await hack.save();
    res.json(hack);
  } catch (err) {
    console.error('Update hack', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete hackathon
router.delete('/hackathons/:id', async (req, res) => {
  try {
    const hack = await Hackathon.findById(req.params.id);
    if (!hack) return res.status(404).json({ message: 'Not found' });
    if (String(hack.organizer) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organizer-accessible users (participants & judges)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['participant','judge'] } }).select('name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign participant
router.post('/hackathons/:id/participants', async (req, res) => {
  try {
    const { userId } = req.body;
    const h = await Hackathon.findByIdAndUpdate(req.params.id, { $addToSet: { participants: userId } }, { new: true })
      .populate('participants', 'name email')
      .populate('judges', 'name email');
    if (!h) return res.status(404).json({ message: 'Not found' });
    res.json(h);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign judge + create notification
router.post('/hackathons/:id/judges', async (req, res) => {
  try {
    const { userId } = req.body;
    const h = await Hackathon.findByIdAndUpdate(req.params.id, { $addToSet: { judges: userId } }, { new: true })
      .populate('participants', 'name email')
      .populate('judges', 'name email');
    if (!h) return res.status(404).json({ message: 'Not found' });

    // create notification
    await Notification.create({
      toUser: userId,
      message: `You were assigned as a judge for "${h.title}"`,
      meta: { hackathonId: h._id, type: 'assigned_judge' }
    });

    res.json(h);
  } catch (err) {
    console.error('Assign judge', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove assignment (participants / judges)
router.delete('/hackathons/:id/:role/:userId', async (req, res) => {
  try {
    const { id, role, userId } = req.params;
    if (!['participants','judges'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const update = { $pull: {} };
    update.$pull[role] = userId;
    const h = await Hackathon.findByIdAndUpdate(id, update, { new: true })
      .populate('participants', 'name email')
      .populate('judges', 'name email');
    if (!h) return res.status(404).json({ message: 'Not found' });
    res.json(h);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
