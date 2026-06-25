import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

// Basic in-memory cache for IP request tracking.
const ipRequestStore = new Map();

/**
 * Custom lightweight rate limiting middleware to prevent API abuse and brute-force.
 * Uses a sliding window based on simple interval sweeps.
 *
 * @param {Object} options Configuration options
 * @param {number} options.windowMs Time window in milliseconds (default 15 minutes)
 * @param {number} options.max Maximum requests allowed in the window (default 100)
 * @param {string} options.message Error message to send when limit is exceeded
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 mins
  const max = options.max || 100;
  const message = options.message || "Too many requests from this IP, please try again later.";

  // Periodic cleanup of expired cache entries to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestStore.entries()) {
      if (now > data.resetTime) {
        ipRequestStore.delete(ip);
      }
    }
  }, windowMs);

  return catchAsyncErrors(async (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequestStore.has(ip)) {
      ipRequestStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const clientData = ipRequestStore.get(ip);

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      return next();
    }

    clientData.count += 1;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - clientData.count));
    res.setHeader("X-RateLimit-Reset", new Date(clientData.resetTime).toUTCString());

    if (clientData.count > max) {
      return next(new ErrorHandler(message, 429));
    }

    next();
  });
};

export default rateLimiter;
