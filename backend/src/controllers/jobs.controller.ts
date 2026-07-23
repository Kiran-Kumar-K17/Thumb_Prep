import type { Request, Response } from "express";
import { JobService } from "../services/jobs.service.js";
import { ImageKitService } from "../services/imagekit.service.js";
import { thumbnailQueue } from "../queues/thumbnail.queue.js";

export class JobsController {
  static async create(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      const file = req.file;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          message: "Prompt is required",
        });
      }

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      // Upload original image to ImageKit
      const uploadedImage = await ImageKitService.upload(file);

      // Create Job
      const job = await JobService.create({
        prompt,
        imageUrl: uploadedImage.url,
      });

      // Push job to BullMQ
      await thumbnailQueue.add("generate-thumbnail", {
        jobId: job.id,
      });

      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: {
          jobId: job.id,
          status: job.status,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  static async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Job id is required",
        });
      }
      const job = await JobService.getById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
