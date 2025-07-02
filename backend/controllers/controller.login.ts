import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface LoginBody {
  email: string;
  password: string;
}

export const loginController: RequestHandler<{}, any, LoginBody> = async (
  req,
  res,
  next,
) => {
  try {
    const { email, password } = req.body;

    /* 1️⃣ Хэрэглэгч шалгах */
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return; // <- void
    }

    /* 2️⃣ Нууц үг тааруулах */
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    /* 3️⃣ JWT үүсгэх */
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    /* 4️⃣ Амжилттай хариу */
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};
