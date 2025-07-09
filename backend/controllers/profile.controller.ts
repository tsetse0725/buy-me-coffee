/* src/controllers/profile.controller.ts */
import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../utils/prisma";
import streamifier from "streamifier";
import type { Express } from "express";

/* ───── Cloudinary helper ───── */
async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string,
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result as { secure_url: string });
      },
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

/* ───── Request body ───── */
interface ProfileBody {
  name: string;
  about: string;
  socialMediaURL: string;
  userId: string;
  successMessage?: string;
}

/* ───────────────────────────────────────────────────── */
/* POST /profiles/upload-avatar (avatar + optional cover) */
/* ───────────────────────────────────────────────────── */
export const uploadAvatar = async (
  req: Request<{}, any, ProfileBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name = "",
      about = "",
      socialMediaURL = "",
      userId,
      successMessage = "",
    } = req.body;

    const uid = Number(userId);
    if (isNaN(uid)) return void res.status(400).json({ message: "Invalid userId" });

    const files = req.files as undefined | { [key: string]: Express.Multer.File[] };
    const avatarFile = files?.avatar?.[0];
    const coverFile  = files?.cover?.[0];

    let avatar_url = "";
    let cover_url  = "";

    if (avatarFile)
      avatar_url = (await uploadToCloudinary(avatarFile, "avatars")).secure_url;
    if (coverFile)
      cover_url  = (await uploadToCloudinary(coverFile,  "covers" )).secure_url;

    const profile = await prisma.profile.upsert({
      where: { userId: uid },
      create: {
        name,
        about,
        socialMediaURL,
        avatarImage: avatar_url,
        backgroundImage: cover_url,
        successMessage,
        userId: uid,
      },
      update: {
        ...(name.trim() && { name }),
        ...(about.trim() && { about }),
        ...(socialMediaURL.trim() && { socialMediaURL }),
        ...(successMessage.trim() && { successMessage }),
        ...(avatar_url && { avatarImage: avatar_url }),
        ...(cover_url && { backgroundImage: cover_url }),
      },
      include: { user: { select: { username: true } } },
    });

    res.status(201).json({
      id: profile.id,
      userId: profile.userId,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      avatarImage: profile.avatarImage,
      socialMediaURL: profile.socialMediaURL,
      coverImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────── */
/* POST /profiles/upload-cover (cover only, upsert) */
/* ──────────────────────────────────────────────── */
export const uploadCover = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const uid = Number(req.body.userId);
    const file = req.file as Express.Multer.File | undefined;

    if (isNaN(uid) || !file) {
      return void res.status(400).json({ message: "Invalid data" });
    }

    const { secure_url } = await uploadToCloudinary(file, "covers");

    /* create if missing, else update */
    await prisma.profile.upsert({
      where: { userId: uid },
      create: {
        userId: uid,
        backgroundImage: secure_url,
        name: "",
        about: "",
        socialMediaURL: "",
        avatarImage: "",
        successMessage: "",
      },
      update: { backgroundImage: secure_url },
    });

    res.status(200).json({ url: secure_url });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────── */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const uid = Number(req.params.userId);
    if (isNaN(uid)) return void res.status(400).json({ message: "Invalid userId" });

    const profile = await prisma.profile.findUnique({
      where: { userId: uid },
      include: { user: { select: { username: true } } },
    });
    if (!profile) return void res.status(404).json({ message: "Profile not found" });

    res.json({
      id: profile.id,
      userId: profile.userId,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      avatarImage: profile.avatarImage,
      socialMediaURL: profile.socialMediaURL,
      coverImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────── */
export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username } = req.params;
    const profile = await prisma.profile.findFirst({
      where: { user: { username } },
      include: { user: { select: { username: true } } },
    });
    if (!profile) return void res.status(404).json({ message: "Profile not found" });

    res.json({
      id: profile.id,
      userId: profile.userId,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      avatarImage: profile.avatarImage,
      socialMediaURL: profile.socialMediaURL,
      coverImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    });
  } catch (err) {
    next(err);
  }
};