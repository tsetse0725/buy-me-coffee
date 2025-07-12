"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankcard_controller_1 = require("../controllers/bankcard.controller");
const router = (0, express_1.Router)();
router.post("/", bankcard_controller_1.createOrUpdateBankCard);
router.get("/:userId", bankcard_controller_1.getBankCard);
router.delete("/:userId", bankcard_controller_1.deleteBankCard);
exports.default = router;
//# sourceMappingURL=bankcard.routes.js.map