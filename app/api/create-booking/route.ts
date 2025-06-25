import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { booking } = await req.json();
  const { startDate, endDate, totalPrice, homeId } = booking;

  const bookingData = {
    startDate,
    endDate,
    totalPrice,
    homeId,
    emailId: user.emailAddresses[0].emailAddress,
    phoneNo: user.phoneNumbers[0].phoneNumber,
    userId: user.id,
  };

  const foundBooking = await prismadb.booking.create({
    data: bookingData,
  });
  return NextResponse.json(foundBooking);
}
