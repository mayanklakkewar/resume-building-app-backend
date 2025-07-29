import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResumes,
  updateResume,
} from "../controllers/resumeControllers.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";

const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getUserResumes);
router.get("/:id", protect, getResumeById);

router.put("/:id", protect, updateResume);
router.put("/:id/upload-images", protect, uploadResumeImages);

router.delete("/:id", protect, deleteResume);

export default router;
