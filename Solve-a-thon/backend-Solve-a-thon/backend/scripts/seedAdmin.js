require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set in env');
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const email = 'admin@hack.com';
    const exists = await User.findOne({ email });
    if (!exists) {
      const hash = await bcrypt.hash('Admin123!', 10);
      await User.create({ name: 'Admin', email, passwordHash: hash, role: 'admin' });
      console.log('Admin user created:', email);
    } else {
      console.log('Admin already exists');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
})();
