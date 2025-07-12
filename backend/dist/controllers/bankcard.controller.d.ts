import { Request, Response, NextFunction } from "express";
export declare const createOrUpdateBankCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getBankCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteBankCard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
