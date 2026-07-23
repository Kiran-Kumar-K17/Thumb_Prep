import { Worker } from "bullmq";
import { ThumbnailService } from "../services/thumbnail.service.js";
import redis from "../config/redis.js";

export const thumbnailWorker = new Worker(
  "thumbnail",
  async (job) => {
    console.log("Processing Job");

    console.log(job.id);
    console.log(job.name);
    console.log(job.data);

    await ThumbnailService.process(job.data.jobId);

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
