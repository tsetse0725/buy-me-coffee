"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const JWT_SECRET = process.env.JWT_SECRET;
const signupController = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const exists = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (exists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { email, password: hashedPassword, username },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({
            token,
            user: { id: user.id, email: user.email, username: user.username },
        });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.signupController = signupController;
//# sourceMappingURL=controller.signup.js.map