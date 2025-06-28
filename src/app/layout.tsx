import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { StaticNoise } from "@/components/static-noise";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner"
import { NavbarWP } from "@/components/resizable-navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Wallpaper Pick - Beautiful Wallpapers",
    template: "%s - Wallpaper Pick",
  },
  description: "Discover, preview, and download stunning high-quality wallpapers for your desktop and mobile. Curated collections, trending backgrounds, and easy downloads.",
  keywords: [
    "wallpapers",
    "backgrounds",
    "desktop wallpapers",
    "mobile wallpapers",
    "HD wallpapers",
    "4K wallpapers",
    "wallpaper library",
    "download wallpapers",
    "beautiful wallpapers",
    "aesthetic backgrounds"
  ],
  metadataBase: new URL("https://wallpaper-pick.vercel.app"),
  openGraph: {
    title: "Wallpaper Pick - Beautiful Wallpapers",
    description: "Discover, preview, and download stunning high-quality wallpapers for your desktop and mobile. Curated collections, trending backgrounds, and easy downloads.",
    url: "https://wallpaper-pick.vercel.app",
    siteName: "Wallpaper Pick",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallpaper Pick - Beautiful Wallpapers",
    description: "Discover, preview, and download stunning high-quality wallpapers for your desktop and mobile. Curated collections, trending backgrounds, and easy downloads.",
    creator: "@cojocarudavidme"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} ${syne.variable}`} lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className="antialiased bg-background"
      >
        <Providers>
          {/* Grid Pattern */}
          <div className="absolute z-0 fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <NavbarWP />
          <main className="relative z-20">
            {children}
          </main>
          {/* Static Noise */}
          <StaticNoise
            opacity={0.06}
            className="z-50 fixed inset-0 pointer-events-none"
          />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
