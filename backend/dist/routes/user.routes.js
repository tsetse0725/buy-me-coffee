"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_user_1 = require("../controllers/controller.user");
const router = (0, express_1.Router)();
router.patch("/:userId/password", controller_user_1.updatePasswordController);
exports.default = router;
//# sourceMappingURL=user.routes.js.map