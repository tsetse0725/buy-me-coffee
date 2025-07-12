import { RequestHandler } from "express";
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}
export declare const authRequired: RequestHandler;
