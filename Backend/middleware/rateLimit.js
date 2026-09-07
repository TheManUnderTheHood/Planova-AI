const cache = require('../services/cacheService');

const rateLimit = ({ windowMs, max, message }) => async (req, res, next) => {
  const key = `rate-limit:${req.ip}:${req.baseUrl}${req.path}`;
  const count = await cache.increment(key, Math.ceil(windowMs / 1000));

  if (count > max) {
    return res.status(429).json({ success: false, error: message });
  }

  return next();
};

module.exports = rateLimit;