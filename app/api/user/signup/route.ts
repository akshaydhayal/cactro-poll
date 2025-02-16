import { NextRequest } from "next/server";
import {z} from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prismaClient=new PrismaClient();
const userSchema=z.object({
    name:z.string(),
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
        const {name,email,password}=parsedResponse.data;
        const hashedPassword=await bcrypt.hash(password,10);
        await prismaClient.user.create({
            data:{name,email,password:hashedPassword}
        })
        return Response.json({msg:"user signed up!!"},{status:201});
    } catch (error) {
        console.log(error);
        return Response.json({msg:"Internal server error"},{status:500});
    }
}