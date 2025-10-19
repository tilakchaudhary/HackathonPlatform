const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    authMiddleware(req, res, () => {
      if (req.user && (req.user.role === role || req.user.role === 'admin')) return next();
      return res.status(403).json({ message: 'Forbidden' });
    });
  };
}

module.exports = { authMiddleware, requireRole };
