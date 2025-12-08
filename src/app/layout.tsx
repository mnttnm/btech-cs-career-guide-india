import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerGuide - Find Your Perfect Tech Career",
  description: "Compare 45+ tech career paths with real salary data, personality-based recommendations, and personalized roadmaps for Indian B.Tech students.",
  keywords: ["career guidance", "B.Tech careers", "tech jobs India", "software engineering", "data science careers"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {/* Skip links for keyboard/screen reader users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
          >
            Skip to main content
          </a>
          <Navigation />
          <main id="main-content" className="min-h-screen pt-14 pb-20 md:pt-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" richColors closeButton />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
