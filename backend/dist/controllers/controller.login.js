"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({
            token,
            user: { id: user.id, email: user.email, username: user.username },
        });
    }
    catch (err) {
        console.error("Login error:", err);
        next(err);
    }
};
exports.loginController = loginController;
//# sourceMappingURL=controller.login.js.map