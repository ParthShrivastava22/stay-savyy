// /components/BookingCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Booking } from "@prisma/client";
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Home } from "@prisma/client";

const BookingCard = ({ booking }: { booking: Booking }) => {
  const [home, setHome] = useState<Home | null>(null);
  console.log(home);
  const router = useRouter();

  useEffect(() => {
    const fetchHome = async () => {
      if (booking.homeId) {
        try {
          const response = await fetch(`/api/home/${booking.homeId}`);
          const data = await response.json();
          setHome(data);
        } catch (error) {
          console.error("Failed to fetch home:", error);
        }
      }
    };

    fetchHome();
  }, [booking.homeId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return <CheckCircle className="text-green-500" size={16} />;
      case "CANCELLED":
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-50 border-green-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getLocationString = () => {
    if (!home) return "";
    const { city, state, country } = home;
    return `${city}, ${state}, ${country}`;
  };

  return (
    <div
      onClick={() => router.push(`/booking-details/${booking.id}`)}
      className={cn("col-span-1 cursor-pointer transition hover:scale-105")}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        {home && (
          <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
            <Image
              fill
              src={home.image}
              alt={home.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-3 py-4 text-sm">
          {/* Header with title and status */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight">
              {home?.title || "Home Booking"}
            </h3>
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                getStatusColor()
              )}
            >
              {getStatusIcon()}
              {booking.status}
            </div>
          </div>

          {/* Location and dates */}
          <div className="space-y-2 flex-1">
            {home && (
              <div className="text-primary/80 flex items-center gap-2">
                <MapPin size={14} />
                <span className="text-xs">{getLocationString()}</span>
              </div>
            )}

            <div className="text-primary/80 flex items-center gap-2">
              <Calendar size={14} />
              <span className="text-xs">
                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              </span>
            </div>
          </div>

          {/* Price and duration */}
          <div className="space-y-1">
            <div className="text-primary/70 text-xs">
              {calculateNights()} {calculateNights() === 1 ? "night" : "nights"}
            </div>
            <div className="font-semibold text-lg">
              ${Number(booking.totalPrice).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
