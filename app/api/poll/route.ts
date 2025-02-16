import jwt  from 'jsonwebtoken';
import { NextRequest } from "next/server";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prismaClient=new PrismaClient();
const pollSchema=z.object({
    question:z.string(),
    option:z.array(z.string())
})
export async function POST(req:NextRequest){
    try {
        const body=await req.json();
        const parsedResponse=pollSchema.safeParse(body);
        if(!parsedResponse.success){
            return Response.json({msg:parsedResponse.error},{status:401});
        }
        const cookieStore=await cookies();
        const token=cookieStore.get('token');
        if(!token){
            return Response.json({msg:'Wrong jwt token'}, {status:401});
        }
        if(!process.env.JWT_SECRET){
            return Response.json({msg:'no jwt secret'}, {status:401});
        }
        const decodedToken=jwt.verify(token.value,process.env.JWT_SECRET);
        console.log(decodedToken);
        console.log(token);
        //@ts-expect-error:error
        const user=await prismaClient.user.findUnique({where:{id:decodedToken.userId}})
        if(!user){
            return Response.json({msg:'User not found'}, {status:401});
        }
        
        const {question,option}=parsedResponse.data;
        await prismaClient.poll.create({data:{question,option,userId:user.id}})
        return Response.json({msg:"poll created!!"},{status:201});
    } catch (error) {
        console.log(error);
        return Response.json({msg:"Internal server error"},{status:500});
    }
}

export async function GET(){
    try{
        const polls=await prismaClient.poll.findMany({});
        return Response.json({polls},{status:200});
    }catch(e){
        console.log(e);
        return Response.json({msg:"Internal server error"},{status:500});
    }
}