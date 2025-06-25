// /components/BookingList.tsx
"use client";

import BookingCard from "./BookingCard";
import { Booking } from "@prisma/client";
const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
      {bookings.map((booking) => (
        <div key={booking.id}>
          <BookingCard booking={booking} />
        </div>
      ))}
    </div>
  );
};

export default BookingList;
