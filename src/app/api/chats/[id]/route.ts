import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// UPDATE CHAT TITLE
export async function PATCH(
  req: Request,
  { params }: Params
) {
  try {
    const body = await req.json();

    const { id } = await params;

    const updatedChat =
      await prisma.chat.update({
        where: {
          id,
        },
        data: {
          title: body.title,
        },
      });

    return NextResponse.json(
      updatedChat
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to update chat",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE CHAT
export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.chat.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to delete chat",
      },
      {
        status: 500,
      }
    );
  }
}