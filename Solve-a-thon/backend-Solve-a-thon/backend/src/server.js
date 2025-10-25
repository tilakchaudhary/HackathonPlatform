// src/server.js
require('dotenv').config();
const app = require('./app');
const { initDb } = require('./config/db');

const PORT = process.env.PORT || 5000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB init error', err);
  process.exit(1);
});
