import { type AuthChecker } from "type-graphql";
import jwt from "jsonwebtoken";
import {type Request, type Response} from "express";

export interface MyContext{
    req: Request;
    res: Response;
    user?: {
        userId: string,
        email: string,
        role: string
    }
}

export const authChecker: AuthChecker<MyContext> = ({context}) => {
    const ctx = context as any
    const token = ctx.req.headers.authorization?.split(" ")[1];

    if(!token) return false;

    try{
        const decoded = jwt.verify(token, String(process.env.JWT_SECRET)) as any;
        ctx.user = decoded

        return true;
    }
    catch(err: any){
        console.log("error in authorization", err.message)
        return false
    }
}