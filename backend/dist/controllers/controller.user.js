"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordController = void 0;
const prisma_1 = require("../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updatePasswordController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;
        if (!userId || !password) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.user.update({
            where: { id: Number(userId) },
            data: { password: hashedPassword },
        });
        res.status(200).json({ message: " Password updated" });
    }
    catch (err) {
        console.error(" Error updating password:", err);
        next(err);
    }
};
exports.updatePasswordController = updatePasswordController;
//# sourceMappingURL=controller.user.js.map