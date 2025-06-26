/* eslint-disable @typescript-eslint/no-unused-vars */

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ homeId: string }> }
) {
  const { userId } = await auth();
  const awaitedParams = await params;

  if (!awaitedParams.homeId) {
    return new NextResponse("Home Id is required", { status: 400 });
  }

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const home = await prismadb.home.findUnique({
    where: { id: awaitedParams.homeId },
  });

  return NextResponse.json(home);
}

export async function PATCH(
  req: Request,
  { params }: { params: { homeId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = await auth();
    const awaitedParams = await params;

    if (!awaitedParams.homeId) {
      return new NextResponse("Home Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const home = await prismadb.home.update({
      where: { id: awaitedParams.homeId },
      data: { ...body },
    });

    return NextResponse.json(home);
  } catch (error) {
    console.log("ERROR at /api/home/homeId PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { homeId: string } }
) {
  try {
    const { userId } = await auth();
    const awaitedParams = await params;

    if (!awaitedParams.homeId) {
      return new NextResponse("Home Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const home = await prismadb.home.delete({
      where: { id: awaitedParams.homeId },
    });

    return NextResponse.json(home);
  } catch (error) {
    console.log("ERROR at /api/home/homeId DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
