import "dotenv/config";

export const environments = {
  mode: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  redisNamespace: {
    verifyAttemptSign: "verifyAttemptSign",
    verifySignUp: "verifySignUp",
    changePassword: "changePassword",
  },
  jwtSecret: process.env.JWT_SECRET,
};
