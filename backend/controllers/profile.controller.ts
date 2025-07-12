import { Request, Response, NextFunction } from "express";
import { cloudinary } from "../utils/cloudinary";
import { prisma } from "../utils/prisma";
import streamifier from "streamifier";



async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string
): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result as { secure_url: string });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}


export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    if (isNaN(uid))
      return void res.status(400).json({ message: "Invalid userId" });

    const files = req.files as
      | undefined
      | { [key: string]: Express.Multer.File[] };
    const avatarFile = files?.avatar?.[0];
    const coverFile = files?.cover?.[0];

    let avatar_url = "";
    let cover_url = "";

    if (avatarFile)
      avatar_url = (await uploadToCloudinary(avatarFile, "avatars")).secure_url;
    if (coverFile)
      cover_url = (await uploadToCloudinary(coverFile, "covers")).secure_url;

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


export const uploadCover = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = Number(req.body.userId);
    const file = req.file as Express.Multer.File | undefined;

    if (isNaN(uid) || !file) {
      return void res.status(400).json({ message: "Invalid data" });
    }

    const { secure_url } = await uploadToCloudinary(file, "covers");

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


export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = Number(req.params.userId);
    if (isNaN(uid))
      return void res.status(400).json({ message: "Invalid userId" });

    const profile = await prisma.profile.findUnique({
      where: { userId: uid },
      include: { user: { select: { username: true } } },
    });
    if (!profile)
      return void res.status(404).json({ message: "Profile not found" });

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


export const getAllProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = profiles.map((profile) => ({
      id: profile.id,
      userId: profile.userId,
      username: profile.user.username,
      name: profile.name,
      about: profile.about,
      avatarImage: profile.avatarImage,
      socialMediaURL: profile.socialMediaURL,
      coverImage: profile.backgroundImage,
      successMessage: profile.successMessage,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};


export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    const profile = await prisma.profile.findFirst({
      where: { user: { username } },
      include: { user: { select: { username: true } } },
    });
    if (!profile)
      return void res.status(404).json({ message: "Profile not found" });

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


export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = Number(req.params.userId);
    console.log(" userId:", uid);
    console.log(" Request Body:", req.body);

    if (isNaN(uid)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    const { name, about, socialMediaURL, successMessage } = req.body;

    if (!name && !about && !socialMediaURL && !successMessage) {
      res.status(400).json({ message: "No data to update" });
      return;
    }

    const data: any = {};

    if (typeof name === "string" && name.trim()) data.name = name.trim();
    if (typeof about === "string" && about.trim()) data.about = about.trim();
    if (typeof socialMediaURL === "string" && socialMediaURL.trim())
      data.socialMediaURL = socialMediaURL.trim();
    if (typeof successMessage === "string" && successMessage.trim())
      data.successMessage = successMessage.trim();

    const updated = await prisma.profile.update({
      where: { userId: uid },
      data,
    });

    res.status(200).json({
      message: " Profile updated successfully",
      updatedProfile: updated,
    });
  } catch (err) {
    console.error(" updateProfile error:", err);
    next(err);
  }
};


