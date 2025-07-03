import { Router } from "express";
import { upload } from "../middlewares/multer";
import { uploadAvatar } from "../controllers/profile.controller";

const router = Router();

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default router;
