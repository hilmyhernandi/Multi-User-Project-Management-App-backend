import { redisConnection } from "../connections/redis";

const setRedisValue = async (key: string, value: unknown, times: number) => {
  const stringValue = JSON.stringify(value);
  return await redisConnection.set(key, stringValue, "EX", times);
};

const getRedisValue = async (key: string) => {
  return await redisConnection.get(key);
};

const deleteRedisKey = async (key: string) => {
  return await redisConnection.del(key);
};

export default {
  setRedisValue,
  getRedisValue,
  deleteRedisKey,
};
