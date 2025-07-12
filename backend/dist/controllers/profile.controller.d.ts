import { Request, Response, NextFunction } from "express";
export declare const uploadAvatar: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const uploadCover: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllProfiles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfileByUsername: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
