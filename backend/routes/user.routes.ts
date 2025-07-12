// backend/routes/user.routes.ts
import { Router } from "express";
import { updatePasswordController } from "../controllers/controller.user";

const router = Router();

// 🔒 PATCH /users/:userId/password
router.patch("/:userId/password", updatePasswordController);

export default router;
