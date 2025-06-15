import { logger } from "./config/logger";
import { redisConnection } from "./connections/redis";
import { web } from "./web";

const Port = 4000;

async function startServer() {
  try {
    redisConnection;
    web.listen(Port, () => {
      logger.info(`Server is running on http://localhost:${Port}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error);
    process.exit(1);
  }
}
startServer();
