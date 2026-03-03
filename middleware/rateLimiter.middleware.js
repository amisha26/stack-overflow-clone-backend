const redis = require('../config/redis');
const { sendError } = require('../utils/response');

const fixedWindow= (limit, windowInSeconds) => {
    return async (req, res, next) => {
        try {
            const ip = req.ip;
            const baseKey = `rate:v1:${ip}`;
            const lockKey = `rate:lock:${ip}`;

            // check if user is locked
            const isLocked = await redis.get(lockKey);
            if (isLocked) {
                return sendError(res, 429, "Too many requests. Try again later.");
            }

            const currentCount = await redis.incr(baseKey);

            if (currentCount == 1) {
                await redis.expire(baseKey, windowInSeconds);
            }

            if (currentCount > limit) {
                // start cooldown
                await redis.set(lockKey, "1", "EX", windowInSeconds);
                return sendError(res, 429, "Too many requests. Cooldown started.");
            }
            return next();

        } catch (error) {
            return sendError(res, 400, error);
        }

    }
}

module.exports = fixedWindow;