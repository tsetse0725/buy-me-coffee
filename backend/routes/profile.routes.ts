import { Router } from "express";
import { uploadAvatar, getProfile } from "../controllers/profile.controller";
import upload from "../middlewares/multer";

const router = Router();

// 🔥 POST /profiles/upload-avatar – зурагтай profile үүсгэх
router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

// ✅ GET /profiles/:userId – тухайн хэрэглэгчийн profile info авах
router.get("/:userId", getProfile);

export default router;
