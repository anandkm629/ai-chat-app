import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const chats =
      await prisma.chat.findMany({
        where: {
          userId,
        },

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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const chat =
      await prisma.chat.create({
        data: {
          title: "New Chat",
          userId,
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