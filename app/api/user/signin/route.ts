import { NextRequest } from "next/server";
import {z} from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prismaClient=new PrismaClient();
const userSchema=z.object({
    email:z.string().email(),
    password:z.string().min(1).max(20)
})
export async function POST(req:NextRequest){
    try {
        const body=await req.json();
        const parsedResponse=userSchema.safeParse(body);
        if(!parsedResponse.success){
            return Response.json({msg:parsedResponse.error},{status:401});
        }
        const {email,password}=parsedResponse.data;
        const user=await prismaClient.user.findFirst({
            where:{email}
        });
        if(!user){
            return Response.json({msg:"User doesn't exist!!"},{status:401});
        }
        const hashedPassword=await bcrypt.compare(password,user.password);
        if(!hashedPassword){
            return Response.json({msg:"Invalid password"},{status:401});
        }
        const cookieStore=await cookies();
        if(!process.env.JWT_SECRET){
            return Response.json({msg:"Invalid JWT Secret"},{status:401});
        }
        const token=jwt.sign({userId:user.id},process.env.JWT_SECRET);
        cookieStore.set('token',token);
        return Response.json({msg:"Login successful"},{status:200});
    } catch (error) {
        console.log(error);
        return Response.json({msg:"Internal server error"},{status:500});
    }
}