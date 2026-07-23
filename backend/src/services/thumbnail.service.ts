import { JobStatus } from "../../generated/prisma/client";
import { JobService } from "./jobs.service.js";

export class ThumbnailService {
  static async process(jobId: string) {
    try {
      const job = await JobService.getById(jobId);

      if (!job) {
        throw new Error("Job not found");
      }

      await JobService.updateStatus(jobId, JobStatus.PROCESSING);

      console.log(`Processing thumbnail for job: ${jobId}`);

      // Simulate long-running work
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await JobService.updateStatus(jobId, JobStatus.COMPLETED);

      console.log(`Thumbnail generation completed for job: ${jobId}`);
    } catch (error) {
      await JobService.fail(jobId);

      console.error(error);
      throw error;
    }
  }
}
