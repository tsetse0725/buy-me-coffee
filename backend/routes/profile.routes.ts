import { Router } from "express";
import { uploadAvatar, getProfile } from "../controllers/profile.controller";
import upload from "../middlewares/multer";

const router = Router();


router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

router.get("/:userId", getProfile);

export default router;
