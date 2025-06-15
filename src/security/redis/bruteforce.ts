import { redisConnection } from "../../connections/redis";
import rateLimit from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import redisService from "../../service/redisService";

const windowMs = 15 * 60 * 1000;
const maxAttempts = 3;

const bruteForce = rateLimit({
  store: new RedisStore({
    sendCommand: async (
      command: string,
      ...args: string[]
    ): Promise<RedisReply> => {
      return redisConnection.call(command, ...args) as Promise<RedisReply>;
    },
  }),
  windowMs,
  max: maxAttempts,
  standardHeaders: true,
  legacyHeaders: false,
});

const checkRateLimit = async (email: string) => {
  const rateLimitKey = `loginAttempts:${email}`;
  const attempts = await redisService.getRedisValue(rateLimitKey);
  return attempts ? parseInt(attempts) : 0;
};

const trackFailedLogin = async (email: string) => {
  const rateLimitKey = `loginAttempts:${email}`;
  await redisConnection.incr(rateLimitKey);
  await redisConnection.expire(rateLimitKey, windowMs / 1000);
};

const resetFailedLoginAttempts = async (email: string) => {
  const rateLimitKey = `loginAttempts:${email}`;
  const attempts = await redisService.getRedisValue(rateLimitKey);
  if (attempts && parseInt(attempts) < maxAttempts) {
    await redisService.deleteRedisKey(rateLimitKey);
  }
};

export default {
  bruteForce,
  checkRateLimit,
  trackFailedLogin,
  resetFailedLoginAttempts,
};
