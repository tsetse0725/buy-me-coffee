import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../utils/prisma"; // 👉 prisma helper чинь энд байрлана
import streamifier from "streamifier";

// 📌 request body‑н type тодорхойлж өгвөл TypeScript алдаагүй болно

interface ProfileBody {
  name: string;
  about: string;
  socialMediaURL: string;
  userId: string; // string хэлбэрээр ирдэг тул Number() хөрвүүлнэ
  backgroundImage?: string; // optional болгосон
  successMessage?: string;  // optional болгосон
}

export const uploadAvatar = async (
  req: Request<{}, any, ProfileBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    // body талбарууд
    const {
      name,
      about,
      socialMediaURL,
      userId,
      backgroundImage = "",
      successMessage = "",
    } = req.body;

    // Cloudinary руу stream‑ээр upload
    const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const cldStream = cloudinary.uploader.upload_stream(
        { folder: "avatars", resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result as { secure_url: string });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(cldStream);
    });

    // Prisma → Neon DB‑д хадгална
    const profile = await prisma.profile.create({
      data: {
        name,
        about,
        avatarImage: uploaded.secure_url,
        socialMediaURL,
        backgroundImage,
        successMessage,
        user: { connect: { id: Number(userId) } },
      },
    });

    res.status(201).json({ profile });
  } catch (error) {
    console.error("❌ [UPLOAD]", error);
    next(error);

  }
};