const rateLimit = require('express-rate-limit');
const { cache } = require('../config/redis');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// File upload limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many file uploads, please try again later.'
});

// API key-based rate limiter with Redis
const apiKeyLimiter = (maxRequests = 1000, windowMs = 60 * 60 * 1000) => {
  return async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return next();
    }
    
    const key = `rate_limit:${apiKey}`;
    const currentTime = Date.now();
    const windowStart = currentTime - windowMs;
    
    try {
      // Get current request count from cache
      const requests = await cache.get(key) || [];
      
      // Filter requests within the current window
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (recentRequests.length >= maxRequests) {
        const resetTime = recentRequests[0] + windowMs;
        return res.status(429).json({
          status: 'error',
          message: 'API rate limit exceeded',
          limit: maxRequests,
          remaining: 0,
          resetTime: new Date(resetTime).toISOString()
        });
      }
      
      // Add current request timestamp
      recentRequests.push(currentTime);
      
      // Store updated requests
      await cache.set(key, recentRequests, Math.floor(windowMs / 1000));
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - recentRequests.length);
      res.setHeader('X-RateLimit-Reset', new Date(currentTime + windowMs).toISOString());
      
      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next(); // Continue on error
    }
  };
};

// Dynamic rate limiter based on user role
const roleLimiter = () => {
  const limits = {
    Admin: 10000, // 10000 requests per hour
    Expert: 5000,  // 5000 requests per hour
    Farmer: 1000,  // 1000 requests per hour
    Buyer: 1000,   // 1000 requests per hour
    guest: 100     // 100 requests per hour for unauthenticated users
  };
  
  return async (req, res, next) => {
    const role = req.user?.role || 'guest';
    const userId = req.user?._id || req.ip;
    const limit = limits[role] || limits.guest;
    
    const key = `rate_limit:${role}:${userId}`;
    const currentTime = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const windowStart = currentTime - windowMs;
    
    try {
      const requests = await cache.get(key) || [];
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (recentRequests.length >= limit) {
        const resetTime = recentRequests[0] + windowMs;
        return res.status(429).json({
          status: 'error',
          message: `Rate limit exceeded for ${role} users`,
          limit,
          remaining: 0,
          resetTime: new Date(resetTime).toISOString()
        });
      }
      
      recentRequests.push(currentTime);
      await cache.set(key, recentRequests, 3600); // 1 hour TTL
      
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', limit - recentRequests.length);
      res.setHeader('X-RateLimit-Reset', new Date(currentTime + windowMs).toISOString());
      
      next();
    } catch (error) {
      console.error('Role-based rate limiter error:', error);
      next();
    }
  };
};

// Brute force protection for login attempts
const bruteForceProtection = () => {
  return async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next();
    
    const key = `login_attempts:${email}`;
    const maxAttempts = 5;
    const lockoutDuration = 15 * 60; // 15 minutes in seconds
    
    try {
      const attempts = await cache.get(key);
      
      if (attempts && attempts.count >= maxAttempts) {
        const remainingTime = attempts.lockedUntil - Date.now();
        if (remainingTime > 0) {
          return res.status(429).json({
            status: 'error',
            message: 'Account temporarily locked due to multiple failed login attempts',
            lockedUntil: new Date(attempts.lockedUntil).toISOString(),
            remainingTime: Math.ceil(remainingTime / 1000) // in seconds
          });
        }
      }
      
      // Store the original next function to call after login attempt
      const originalNext = next;
      
      // Override res.json to track login success/failure
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        if (res.statusCode === 200 && data.status === 'success') {
          // Successful login - clear attempts
          cache.del(key);
        } else if (res.statusCode === 401) {
          // Failed login - increment attempts
          const newAttempts = {
            count: (attempts?.count || 0) + 1,
            lockedUntil: Date.now() + (lockoutDuration * 1000)
          };
          
          if (newAttempts.count >= maxAttempts) {
            cache.set(key, newAttempts, lockoutDuration);
          } else {
            cache.set(key, newAttempts, 900); // 15 minutes
          }
        }
        return originalJson(data);
      };
      
      originalNext();
    } catch (error) {
      console.error('Brute force protection error:', error);
      next();
    }
  };
};

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  apiKeyLimiter,
  roleLimiter,
  bruteForceProtection
};
