import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../utils/prisma";
import streamifier from "streamifier";

interface ProfileBody {
  name: string;
  about: string;
  socialMediaURL: string;
  userId: string;
  backgroundImage?: string;
  successMessage?: string;
}

// ─────────────────────────────────────────────
// 👤 Upload or update profile (with optional image)
// ─────────────────────────────────────────────
export const uploadAvatar = async (
  req: Request<{}, any, ProfileBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;

    const {
      name,
      about,
      socialMediaURL,
      userId,
      backgroundImage = "",
      successMessage = "",
    } = req.body;

    // Upload new image only if file exists
    let secure_url = "";

    if (file) {
      const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const cldStream = cloudinary.uploader.upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(cldStream);
      });

      secure_url = uploadRes.secure_url;
    }

    // Perform upsert with conditional avatar update
    const profile = await prisma.profile.upsert({
      where: { userId: Number(userId) },
      create: {
        name,
        about,
        avatarImage: secure_url,
        socialMediaURL,
        backgroundImage,
        successMessage,
        userId: Number(userId),
      },
      update: {
        name,
        about,
        socialMediaURL,
        backgroundImage,
        successMessage,
        ...(file && { avatarImage: secure_url }),
      },
      include: {
        user: { select: { username: true } },
      },
    });

    res.status(201).json({
      id: profile.id,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      socialMediaURL: profile.socialMediaURL,
      avatarImage: profile.avatarImage,
      backgroundImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// 📄 Get profile by userId
// ─────────────────────────────────────────────
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: { select: { username: true } },
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json({
      id: profile.id,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      avatarImage: profile.avatarImage,
      socialMediaURL: profile.socialMediaURL,
      backgroundImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    });
  } catch (err) {
    next(err);
  }
};
