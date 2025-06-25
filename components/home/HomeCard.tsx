"use client";

import { HomeFormData } from "./AddHomeForm";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Wifi, Dumbbell, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useState } from "react";

const HomeCard = ({ home }: { home: HomeFormData }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md bg-card overflow-hidden"
      )}
      onClick={() => router.push(`/home-details/${home.id}`)}
    >
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            fill
            src={home.image}
            alt={home.title}
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Like button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 w-8 h-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </Button>

          {/* Price badge */}
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm font-semibold"
          >
            ${home.pricePerNight}/night
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {home.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {home.description}
        </p>

        {/* Amenities */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {home.hasWifi && (
            <div className="flex items-center gap-1.5">
              <Wifi size={14} />
              <span>WiFi</span>
            </div>
          )}
          {home.hasGym && (
            <div className="flex items-center gap-1.5">
              <Dumbbell size={14} />
              <span>Gym</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeCard;
