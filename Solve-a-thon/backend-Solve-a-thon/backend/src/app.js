// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const organizerRoutes = require('./routes/organizer');
const notificationRoutes = require('./routes/notification');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/notifications', notificationRoutes);

// root
app.get('/', (req, res) => res.send('Hackathon API running'));

module.exports = app;
