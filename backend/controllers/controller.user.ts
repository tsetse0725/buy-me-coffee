import type { RequestHandler } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";

export const updatePasswordController: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!userId || !password) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: " Password updated" });
  } catch (err) {
    console.error(" Error updating password:", err);
    next(err); 
  }
};
