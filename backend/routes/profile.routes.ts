import { Router } from "express";
import upload from "../middlewares/multer";
import {
  uploadAvatar,
  uploadCover,
  getProfile,
  getProfileByUsername,
} from "../controllers/profile.controller";

const router = Router();

router.post(
  "/upload-avatar",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  uploadAvatar
);

router.post("/upload-cover", upload.single("cover"), uploadCover);

router.get("/by-username/:username", getProfileByUsername);
router.get("/:userId", getProfile);

export default router;
