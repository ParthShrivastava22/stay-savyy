// /components/BookingsPage.tsx (Client Component)
"use client";

import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import BookingList from "./BookingList";
import { Booking } from "@prisma/client";

const BookingsPage = ({ bookings }: { bookings: Booking[] }) => {
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-primary/70">
          Manage and view all your property bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={64} className="mx-auto mb-4 text-primary/30" />
          <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
          <p className="text-primary/70 mb-4">
            Start exploring and book your first stay!
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Browse Homes
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingBookings.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="text-yellow-500" size={24} />
                Pending Bookings ({pendingBookings.length})
              </h2>
              <BookingList bookings={pendingBookings} />
            </section>
          )}

          {confirmedBookings.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                Confirmed Bookings ({confirmedBookings.length})
              </h2>
              <BookingList bookings={confirmedBookings} />
            </section>
          )}

          {cancelledBookings.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <XCircle className="text-red-500" size={24} />
                Cancelled Bookings ({cancelledBookings.length})
              </h2>
              <BookingList bookings={cancelledBookings} />
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
