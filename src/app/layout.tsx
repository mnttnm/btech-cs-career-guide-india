import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navigation />
        <main className="min-h-screen pt-14 pb-20 md:pt-16 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
