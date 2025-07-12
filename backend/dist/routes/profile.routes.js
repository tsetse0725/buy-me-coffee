"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../middlewares/multer"));
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
router.get("/", profile_controller_1.getAllProfiles);
router.get("/by-username/:username", profile_controller_1.getProfileByUsername);
router.patch("/:userId", profile_controller_1.updateProfile);
router.get("/:userId", profile_controller_1.getProfile);
router.post("/upload-avatar", multer_1.default.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]), profile_controller_1.uploadAvatar);
router.post("/upload-cover", multer_1.default.single("cover"), profile_controller_1.uploadCover);
exports.default = router;
//# sourceMappingURL=profile.routes.js.map