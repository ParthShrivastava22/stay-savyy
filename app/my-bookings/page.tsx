// /app/my-bookings/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import BookingsPage from "@/components/bookings/BookingsPage";

// Server Component - fetches data
export default async function MyBookingsPage() {
  // Get authenticated user
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's bookings with home details
  const bookings = await prismadb.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      home: {
        select: {
          id: true,
          title: true,
          image: true,
          city: true,
          state: true,
          country: true,
          pricePerNight: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data to match your component interface
  const transformedBookings = bookings.map((booking) => ({
    ...booking,
    totalPrice: Number(booking.totalPrice), // Convert Decimal to number
  }));

  return <BookingsPage bookings={transformedBookings} />;
}
