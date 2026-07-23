import { Router } from "express";
import multer from "multer";
import { JobsController } from "../controllers/jobs.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("image"), JobsController.create);

router.get("/:id", JobsController.getById);

export default router;
