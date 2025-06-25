"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex cursor-pointer gap-2 items-center"
          onClick={() => router.push("/home/new")}
        >
          <Plus /> <span>Add Home</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer gap-2 items-center"
          onClick={() => router.push("/my-bookings")}
        >
          <HomeIcon /> <span>My Bookings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
