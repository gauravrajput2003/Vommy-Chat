const redis = require('../config/redis');

const cache = (duration) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        try {
            const cachedData = await redis.get(key);
            
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            
            res.originalJson = res.json;
            res.json = async (data) => {
                await redis.setex(key, duration, JSON.stringify(data));
                res.originalJson(data);
            };
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = cache;