import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prismaClient = new PrismaClient();
const voteSchema = z.object({
  vote: z.number(),
});

export async function PUT(req: NextRequest,{params}:{params:Promise<{pollId:number}>}) {
  try {
    const body = await req.json();
    console.log(body);
    const {pollId}=await params;
    const parsedResponse = voteSchema.safeParse(body);
    if (!parsedResponse.success) {
      return Response.json({ msg: parsedResponse.error }, { status: 401 });
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) {
      return Response.json({ msg: "Wrong jwt token" }, { status: 401 });
    }
    if (!process.env.JWT_SECRET) {
      return Response.json({ msg: "no jwt secret" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);
    console.log(decodedToken);
    //@ts-ignore
    const user = await prismaClient.user.findUnique({ where: { id: decodedToken.userId } });
    if (!user) {
      return Response.json({ msg: "User not found" }, { status: 401 });
    }

    const { vote } = parsedResponse.data;
    console.log(vote);
    const poll=await prismaClient.poll.findUnique({where:{id:Number(pollId)}});
    console.log(poll);

    const updatedPollCount=poll?.pollCount.map((i,ind)=>{
        if(ind==vote-1) return i+1;
        else return i;
    })
    console.log(updatedPollCount);
    await prismaClient.poll.update({
        where:{id:Number(pollId)},
        data:{pollCount:updatedPollCount}
    })
    return Response.json({ msg: "poll voted!!" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ msg: "Internal server error" }, { status: 500 });
  }
}


export async function GET(req: NextRequest,{params}:{params:Promise<{pollId:number}>}) {
    try {
        const {pollId}=await params;
        const poll=await prismaClient.poll.findUnique({where:{id:Number(pollId)}});
        return Response.json({ poll });
    } catch (error) {
      console.log(error);
      return Response.json({ msg: "Internal server error" }, { status: 500 });
    }
  }