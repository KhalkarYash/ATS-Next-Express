const NodeCache = require('node-cache');

// Initialize cache with standard TTL of 10 minutes and check period of 600 seconds
const cache = new NodeCache({
    stdTTL: 600,
    checkperiod: 600
});

// Cache middleware factory
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            res.send(cachedResponse);
            return;
        }

        // Store the original send function
        res.originalSend = res.send;
        res.send = (body) => {
            // Store the response in cache
            cache.set(key, body, duration);
            res.originalSend(body);
        };
        next();
    };
};

// Cache wrapper for expensive operations
const cacheWrapper = async (key, callback, duration = 600) => {
    const cachedData = cache.get(key);
    if (cachedData) {
        return cachedData;
    }

    const freshData = await callback();
    cache.set(key, freshData, duration);
    return freshData;
};

// Clear cache by key pattern
const clearCache = (pattern) => {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => cache.del(key));
};

// Clear entire cache
const clearAllCache = () => {
    cache.flushAll();
};

module.exports = {
    cache,
    cacheMiddleware,
    cacheWrapper,
    clearCache,
    clearAllCache
};