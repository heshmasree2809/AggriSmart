const { createClient } = require('redis');
const { logger } = require('./database');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis: Too many reconnection attempts');
        return false;
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('ready', () => {
  logger.info('Redis Client Ready');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
    // Don't exit - app can work without cache
  }
})();

// Cache helper functions
const cache = {
  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error('Cache get error:', err);
      return null;
    }
  },

  set: async (key, value, expiry = 300) => {
    try {
      await redisClient.setEx(key, expiry, JSON.stringify(value));
      return true;
    } catch (err) {
      logger.error('Cache set error:', err);
      return false;
    }
  },

  del: async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (err) {
      logger.error('Cache delete error:', err);
      return false;
    }
  },

  flush: async () => {
    try {
      await redisClient.flushAll();
      return true;
    } catch (err) {
      logger.error('Cache flush error:', err);
      return false;
    }
  }
};

module.exports = { redisClient, cache };
