import Redis from "ioredis";
import { environments } from "../config/environment";
import { logger, loggerRedis } from "../config/logger";

export const redisConnection = new Redis({
  host: environments.redis.host,
  port: Number(environments.redis.port),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 100, 2000);
    if (times > 10) {
      loggerRedis.error(
        "Redis failed to reconnect after multiple attempts. Exiting"
      );
      process.exit(1);
    }
    return delay;
  },
});

redisConnection.on("connect", () => {
  loggerRedis.info("Connected to Redis");
});

redisConnection.on("ready", () => {
  loggerRedis.info("Redis connection is ready for use");
});

redisConnection.on("close", () => {
  loggerRedis.error("Redis connection closed unexpectedly");
  logger.error("Critical: Redis connection closed, shutting down server");
  process.exit(1);
});

redisConnection.on("end", () => {
  loggerRedis.error("Redis connection ended");
  logger.error("Critical: Redis connection ended, exiting process");
  process.exit(1);
});

redisConnection.on("reconnecting", (delay: number) => {
  loggerRedis.warn(`Attempting to reconnect to Redis in ${delay}ms`);
});

redisConnection.on("error", (err: Error) => {
  loggerRedis.error("Redis connection error", {
    message: err.message,
    stack: err.stack,
  });
});
