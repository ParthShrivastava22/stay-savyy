import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import ClientToaster from "@/components/ClientToaster"; // Fixed client component
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stay Savyy",
  description: "Find homes to stay in",
  icons: {
    icon: "/property-color-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientToaster /> {/* Fixed */}
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <section className="flex-grow">
                <Container>{children}</Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
