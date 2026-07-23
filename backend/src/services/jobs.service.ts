import { prisma, JobStatus } from "../config/prisma";

export class JobService {
  static async create(data: { prompt: string; imageUrl: string }) {
    return prisma.job.create({
      data: {
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        status: JobStatus.PENDING,
      },
    });
  }

  static async getById(id: string) {
    return prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        thumbnail: true,
      },
    });
  }

  static async updateStatus(id: string, status: JobStatus) {
    return prisma.job.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  static async fail(id: string) {
    return prisma.job.update({
      where: {
        id,
      },
      data: {
        status: JobStatus.FAILED,
      },
    });
  }
}
