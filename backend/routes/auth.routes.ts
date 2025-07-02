import { Router } from "express";
import { loginController } from "../controllers/controller.login";
import { signupController } from "../controllers/controller.signup";

const router = Router();
router.post("/signup", signupController);
router.post("/login",  loginController);

export default router;
