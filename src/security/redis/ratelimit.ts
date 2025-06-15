import rateLimit from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { redisConnection } from "../../connections/redis";
import { loggerRedis } from "../../config/logger";

export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (
      command: string,
      ...args: string[]
    ): Promise<RedisReply> => {
      try {
        const result = await redisConnection.call(command, ...args);
        return result as RedisReply;
      } catch (error) {
        loggerRedis.error("Redis sendCommand error in rateLimiter", {
          message: (error as Error).message,
          stack: (error as Error).stack,
          command,
          args,
        });

        throw error;
      }
    },
  }),
  windowMs: 60 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again later",
  },
  handler: (req, res, next, options) => {
    loggerRedis.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});
