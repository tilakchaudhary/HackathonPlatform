const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Hackathon API running'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

initDb().catch(err => console.error('DB init error', err));

module.exports = app;
