const Redis = require('ioredis');
const logger = require('./logger');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        if (times > 3) {
            return null;
        }
        return Math.min(times * 200, 1000);
    }
});

redis.on('error', (error) => {
    console.error('Redis Error:', error);
});

redis.on('connect', () => {
    logger.info('Redis connected successfully');
});

module.exports = redis;