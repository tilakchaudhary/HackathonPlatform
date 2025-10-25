// src/config/db.js
const mongoose = require('mongoose');

async function initDb() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackfly';
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
}

module.exports = { initDb };
