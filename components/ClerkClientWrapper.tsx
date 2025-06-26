// components/ClerkClientWrapper.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
