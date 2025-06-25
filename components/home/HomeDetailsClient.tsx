"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { HomeFormData } from "./AddHomeForm";
import useLocation from "@/hooks/useLocation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Wifi,
  ChefHat,
  Shirt,
  Car,
  Snowflake,
  Flame,
  Waves,
  Dumbbell,
  PawPrint,
  Cigarette,
  Wand2,
  Calendar,
  Star,
  Share,
  Heart,
  ArrowLeft,
} from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import useBookHome from "@/hooks/useBookHome";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export default function HomeDetailsClient({ home }: { home: HomeFormData }) {
  const bookHome = useBookHome();
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(home.country);
  const state = getStateByCode(home.state);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(home.pricePerNight);
  const [days, setDays] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      setTotalPrice(dayCount * home.pricePerNight);
    }
  }, [date, home.pricePerNight]);

  const handleBooking = () => {
    if (!userId) {
      return toast("OOPS! Make sure you are logged in!");
    }
    if (!home?.hostId) {
      return toast("Something went wrong. Refresh the page and try again");
    }

    if (date?.from && date.to) {
      const bookingData = {
        home,
        totalPrice,
        startDate: date.from,
        endDate: date.to,
      };

      bookHome.setHomeData(bookingData);
      fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            home: home,
            homeId: home.id,
            startDate: date.from,
            endDate: date.to,
            totalPrice: totalPrice,
          },
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            return router.push("/login");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          router.push("/my-bookings");
        })
        .catch((error: any) => {
          console.log("Error:", error);
          toast("ERROR!", error.message);
        });
    }
  };

  const amenities = [
    { condition: home.hasWifi, icon: Wifi, label: "WiFi" },
    { condition: home.hasKitchen, icon: ChefHat, label: "Kitchen" },
    { condition: home.hasLaundry, icon: Shirt, label: "Laundry" },
    { condition: home.hasParking, icon: Car, label: "Parking" },
    {
      condition: home.hasAirConditioning,
      icon: Snowflake,
      label: "Air Conditioning",
    },
    { condition: home.hasHeating, icon: Flame, label: "Heating" },
    { condition: home.hasPool, icon: Waves, label: "Pool" },
    { condition: home.hasGym, icon: Dumbbell, label: "Gym" },
    { condition: home.petsAllowed, icon: PawPrint, label: "Pets Allowed" },
    {
      condition: home.smokingAllowed,
      icon: Cigarette,
      label: "Smoking Allowed",
    },
  ].filter((amenity) => amenity.condition);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share size={16} />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-2"
          >
            <Heart
              size={16}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              fill
              src={home.image}
              alt={home.title}
              className="object-cover transition-all duration-300"
              onLoad={() => setImageLoaded(true)}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Price overlay */}
            <Badge
              variant="secondary"
              className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm font-semibold text-lg px-3 py-1"
            >
              ${home.pricePerNight}/night
            </Badge>
          </div>

          {/* Property Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {home.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  {home.city}, {state?.name}, {country?.name}
                </span>
              </div>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.9 · 127 reviews
                </span>
              </div>
            </div>

            <Separator />

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{home.address}</p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">About this place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {home.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  What this place offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <IconComponent size={20} className="text-primary" />
                        <span className="font-medium">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>

                {amenities.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No specific amenities listed for this property.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6" />
                Reserve Your Stay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select your dates
                </label>
                <DateRangePicker date={date} setDate={setDate} />
              </div>

              {/* Price Summary */}
              {days > 0 && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Base price × {days} nights</span>
                    <span>${home.pricePerNight * days}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Booking Button */}
              <Button
                onClick={handleBooking}
                disabled={!date?.from || !date?.to || days === 0}
                className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                {days > 0 ? `Book for $${totalPrice}` : "Select dates to book"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                You won't be charged yet. Complete your booking to confirm.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
