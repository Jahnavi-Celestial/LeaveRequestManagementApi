import { Arg, Mutation, Resolver } from "type-graphql";
import { AppDataSource } from "../database/db.ts";
import { User } from "../entities/User.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

@Resolver()
export class UserResolver{
    @Mutation(()=>String)
    async register(
        @Arg("name", ()=>String) name: string,
        @Arg("email", ()=>String) email: string,
        @Arg("password", ()=>String) password: string,
        @Arg("role", ()=>String) role: string
    ){
        const userRepo = AppDataSource.getRepository(User)
        const isExist = await userRepo.findOne({
            where: {email: email}
        })

        if(isExist){
            throw new Error("User already Exist")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userRepo.save({
            name,
            email,
            password: hashedPassword,
            role: role
        })

        return "User registered successfully"
    }

    @Mutation(()=>String)
    async login(
        @Arg("email", ()=>String) email: string,
        @Arg("password", ()=>String) password: string
    ){
        const userRepo = AppDataSource.getRepository(User)

        const isExist = await userRepo.findOne({
            where: {email: email}
        })

        if(!isExist){
            throw new Error('Please register first')
        }

        const isMatched = bcrypt.compare(password, isExist.password)

        if(!isMatched){
            throw new Error('Invalid creadential')
        }

        const token = jwt.sign({
            id: isExist.id,
            email: email,
            role: isExist.role
        },
        String(process.env.JWT_SECRET),
        {
            expiresIn: "24h"
        }
        )

        return token
    }
}