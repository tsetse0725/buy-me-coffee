import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authRequired: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;       // Bearer xxx

  // ─── 1) Token байхгүй тохиолдол ───────────────────────────────
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;                                       // ⇦ зөвхөн void буцааж байна
  }

  // ─── 2) Token байгаа бол шалгана ───────────────────────────────
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = decoded.userId;
    next();                                       // бүх зүйл OK → дараагийн middleware
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    // return;  // хүсвэл энд бас `return;` -г тавьж болно (void)
  }
};
