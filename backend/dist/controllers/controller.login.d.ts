import { RequestHandler } from "express";
interface LoginBody {
    email: string;
    password: string;
}
export declare const loginController: RequestHandler<{}, any, LoginBody>;
export {};
