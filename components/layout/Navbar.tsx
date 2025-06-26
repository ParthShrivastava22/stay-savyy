"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import { ModeToggle } from "../theme-toggle";
import { NavMenu } from "./NavMenu";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          >
            <div className="relative">
              <Image
                src="/property-color-icon.svg"
                alt="logo"
                width="32"
                height="32"
                className="drop-shadow-sm"
              />
            </div>
            <div className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              StaySavyy
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchInput />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            <NavMenu />
            {userId ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant="ghost"
                  size="sm"
                  className="font-medium"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  size="sm"
                  className="font-medium shadow-sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {userId && <UserButton />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="px-2">
              <SearchInput />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <ModeToggle />
                <NavMenu />
              </div>

              {!userId && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push("/sign-in")}
                    variant="ghost"
                    size="sm"
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => router.push("/sign-up")} size="sm">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
