// src/middleware/requireRole.js
module.exports = function requireRole(role) {
  return (req, res, next) => {
    // authMiddleware should have set req.user
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    // allow admins to do everything too
    if (req.user.role === 'admin' || req.user.role === role) {
      return next();
    }
    return res.status(403).json({ message: `Forbidden: ${role} only` });
  };
};
