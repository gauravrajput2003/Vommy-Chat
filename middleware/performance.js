const logger = require('../config/logger');

const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1e6;
        
        if (duration > 1000) { // Log slow requests (>1s)
            logger.warn(`Slow request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
        }
    });
    
    next();
};

module.exports = performanceMonitor;