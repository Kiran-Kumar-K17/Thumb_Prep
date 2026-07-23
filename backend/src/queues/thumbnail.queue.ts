import { Queue } from "bullmq";
import redis from "../config/redis";

export const thumbnailQueue = new Queue("thumbnail", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});
