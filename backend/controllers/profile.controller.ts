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

    const {
      name,
      about,
      socialMediaURL,
      userId,
      backgroundImage = "",
      successMessage = "",
    } = req.body;

    const { secure_url } = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const cldStream = cloudinary.uploader.upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        streamifier.createReadStream(file.buffer).pipe(cldStream);
      }
    );

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
        avatarImage: secure_url,
        socialMediaURL,
        backgroundImage,
        successMessage,
      },
    });

    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        about: true,
        socialMediaURL: true,
        avatarImage: true,
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
};
