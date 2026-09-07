const windows = new Map();

const rateLimit = ({ windowMs, max, message }) => (req, res, next) => {
  const key = `${req.ip}:${req.baseUrl}${req.path}`;
  const now = Date.now();
  const current = windows.get(key);

  if (!current || now >= current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= max) {
    return res.status(429).json({ success: false, error: message });
  }

  current.count += 1;
  return next();
};

module.exports = rateLimit;