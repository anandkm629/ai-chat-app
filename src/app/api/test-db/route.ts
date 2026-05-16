// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const chat = await prisma.chat.create({
//       data: {
//         title: "Test Chat",
//       },
//     });

//     return NextResponse.json(chat);
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         error: "Database error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }