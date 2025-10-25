// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const auth = req.header('Authorization') || req.headers.authorization;
  if (!auth || !auth.toString().startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }
  const token = auth.toString().split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
