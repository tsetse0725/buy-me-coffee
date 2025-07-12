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

/* ────────────────────────────────────── */
/* 🟢 Бүх профайлыг татах                 */
/* GET /profiles                          */
/* ────────────────────────────────────── */
router.get("/", getAllProfiles);

/* ────────────────────────────────────── */
/* 🔵 Username-р профайл авах             */
/* GET /profiles/by-username/:username    */
/* ⛔️ Энэ нь доорх userId route-с ӨМНӨ байх ёстой */
/* ────────────────────────────────────── */
router.get("/by-username/:username", getProfileByUsername);

/* ────────────────────────────────────── */
/* 🟠 Profile шинэчлэх (name, about гэх мэт) */
/* PATCH /profiles/:userId               */
/* ────────────────────────────────────── */
router.patch("/:userId", updateProfile);

/* ────────────────────────────────────── */
/* 🟡 UserId-р профайл авах               */
/* GET /profiles/:userId                  */
/* ────────────────────────────────────── */
router.get("/:userId", getProfile);

/* ────────────────────────────────────── */
/* 🔴 Зураг upload (avatar + cover хамтад нь) */
/* POST /profiles/upload-avatar          */
/* ────────────────────────────────────── */
router.post(
  "/upload-avatar",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  uploadAvatar
);

/* ────────────────────────────────────── */
/* 🔴 Зөвхөн cover зураг upload хийх       */
/* POST /profiles/upload-cover           */
/* ────────────────────────────────────── */
router.post("/upload-cover", upload.single("cover"), uploadCover);

export default router;
