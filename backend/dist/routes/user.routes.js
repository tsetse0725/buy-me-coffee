"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/user.routes.ts
const express_1 = require("express");
const controller_user_1 = require("../controllers/controller.user");
const router = (0, express_1.Router)();
// 🔒 PATCH /users/:userId/password
router.patch("/:userId/password", controller_user_1.updatePasswordController);
exports.default = router;
//# sourceMappingURL=user.routes.js.map