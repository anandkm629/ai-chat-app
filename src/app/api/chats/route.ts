import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to fetch chats",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST() {
  try {
    const chat = await prisma.chat.create({
      data: {
        title: "New Chat",
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to create chat",
      },
      {
        status: 500,
      }
    );
  }
}