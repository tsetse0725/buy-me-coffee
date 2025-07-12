import { Router } from "express";
import upload from "../middlewares/multer";
import {
  uploadAvatar,
  uploadCover,
  getProfile,
  getProfileByUsername,
  getAllProfiles,
  updateProfile,
} from "../controllers/profile.controller";

const router = Router();


router.get("/", getAllProfiles);

router.get("/by-username/:username", getProfileByUsername);


router.patch("/:userId", updateProfile);


router.get("/:userId", getProfile);


router.post(
  "/upload-avatar",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  uploadAvatar
);


router.post("/upload-cover", upload.single("cover"), uploadCover);

export default router;
