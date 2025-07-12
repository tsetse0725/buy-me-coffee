"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_login_1 = require("../controllers/controller.login");
const controller_signup_1 = require("../controllers/controller.signup");
const router = (0, express_1.Router)();
router.post("/signup", controller_signup_1.signupController);
router.post("/login", controller_login_1.loginController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map