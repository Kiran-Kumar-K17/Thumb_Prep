import { prisma, JobStatus } from "../config/prisma.js";
import { ImageKitService } from "./imagekit.service.js";
import { GeminiService } from "./gemini.service.js";
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

      const image = await ImageKitService.downloadImage(job.imageUrl);

      const generated = await GeminiService.generateThumbnail(
        image,
        "image/jpeg",
        job.prompt,
      );

      const uploaded = await ImageKitService.uploadThumbnail(generated);

      await ThumbnailService.create(job.id, uploaded.url, job.prompt);

      await JobService.updateStatus(jobId, JobStatus.COMPLETED);

      console.log(`Thumbnail generation completed for job: ${jobId}`);
    } catch (error) {
      await JobService.fail(jobId);

      console.error(error);
      throw error;  
    }
  }

  static async create(jobId: string, imageUrl: string, prompt: string) {
    return prisma.thumbnail.create({
      data: {
        jobId,
        imageUrl,
        prompt,
      },
    });
  }
}
