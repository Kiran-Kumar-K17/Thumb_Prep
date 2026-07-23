import { Worker } from "bullmq";
import redis from "../config/redis";

export const thumbnailWorker = new Worker(
  "thumbnail",
  async (job) => {
    console.log("Processing Job");

    console.log(job.id);
    console.log(job.name);
    console.log(job.data);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Job Finished");
  },
  {
    connection: redis,
  },
);

thumbnailWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

thumbnailWorker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.error(err);
});
