import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const home = await prismadb.home.create({
      data: { ...body, hostId: userId },
    });

    return NextResponse.json(home);
  } catch (error) {
    console.log("ERROR at /api/hotel POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
