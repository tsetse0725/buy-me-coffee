/* src/routes/profile.routes.ts */
import { Router } from "express";
import upload from "../middlewares/multer";
import {
  uploadAvatar,
  uploadCover,          // ⬅️ cover controller-ийг import
  getProfile,
  getProfileByUsername,
} from "../controllers/profile.controller";

const router = Router();

/* avatar + cover-ийг нэг дор авч болох хувилбар (optional) */
router.post(
  "/upload-avatar",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover",  maxCount: 1 },
  ]),
  uploadAvatar,
);

/* 🔵 B хувилбар – COVER тусдаа API */
router.post(
  "/upload-cover",
  upload.single("cover"),   // field name = "cover"
  uploadCover,
);

/* ───── бусад GET route-ууд ───── */
router.get("/by-username/:username", getProfileByUsername);
router.get("/:userId", getProfile);

export default router;
