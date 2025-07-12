
import { Router } from "express";
import { updatePasswordController } from "../controllers/controller.user";

const router = Router();


router.patch("/:userId/password", updatePasswordController);

export default router;
