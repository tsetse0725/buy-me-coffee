"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../middlewares/multer"));
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
/* ────────────────────────────────────── */
/* 🟢 Бүх профайлыг татах                 */
/* GET /profiles                          */
/* ────────────────────────────────────── */
router.get("/", profile_controller_1.getAllProfiles);
/* ────────────────────────────────────── */
/* 🔵 Username-р профайл авах             */
/* GET /profiles/by-username/:username    */
/* ⛔️ Энэ нь доорх userId route-с ӨМНӨ байх ёстой */
/* ────────────────────────────────────── */
router.get("/by-username/:username", profile_controller_1.getProfileByUsername);
/* ────────────────────────────────────── */
/* 🟠 Profile шинэчлэх (name, about гэх мэт) */
/* PATCH /profiles/:userId               */
/* ────────────────────────────────────── */
router.patch("/:userId", profile_controller_1.updateProfile);
/* ────────────────────────────────────── */
/* 🟡 UserId-р профайл авах               */
/* GET /profiles/:userId                  */
/* ────────────────────────────────────── */
router.get("/:userId", profile_controller_1.getProfile);
/* ────────────────────────────────────── */
/* 🔴 Зураг upload (avatar + cover хамтад нь) */
/* POST /profiles/upload-avatar          */
/* ────────────────────────────────────── */
router.post("/upload-avatar", multer_1.default.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]), profile_controller_1.uploadAvatar);
/* ────────────────────────────────────── */
/* 🔴 Зөвхөн cover зураг upload хийх       */
/* POST /profiles/upload-cover           */
/* ────────────────────────────────────── */
router.post("/upload-cover", multer_1.default.single("cover"), profile_controller_1.uploadCover);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map