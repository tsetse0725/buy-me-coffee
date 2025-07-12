import { RequestHandler } from "express";
interface SignupBody {
    email: string;
    password: string;
    username: string;
}
export declare const signupController: RequestHandler<{}, any, SignupBody>;
export {};
