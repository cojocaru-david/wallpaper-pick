import { Button } from "@/components/ui/button";
import { MorphingText } from "@/components/magicui/morphing-text";
import Link from "next/link";
import CircularGallery from "@/components/circular-gallery";
import { ArrowRight, Github } from "lucide-react";

const texts = [
  "Wallpaper Pick",
  "Beautiful Wallpapers",
  "Find the Perfect Shot",
  "Download Free Art",
  "Curated Collections",
  "Visual Inspiration",
];

const sampleWallpapers = [
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    text: "Mountain Vista",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    text: "Forest Path",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506043125106-4c01cd3b3279?w=800&h=600&fit=crop",
    text: "Ocean Waves",
  },
  {
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop",
    text: "Desert Dunes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop",
    text: "Northern Lights",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    text: "City Skyline",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759844-d150baec3675?w=800&h=600&fit=crop",
    text: "Alpine Lake",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
    text: "Sunset Valley",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden p-0 m-0">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center pt-12 pb-0 mb-0">
        {/* Main heading with enhanced styling */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full scale-110" />
          <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text">
            <MorphingText texts={texts} />
          </h1>
        </div>

        {/* Subtitle with better typography */}
        <p className="text-base md:text-lg text-muted-foreground/80 max-w-3xl mb-8 leading-relaxed font-medium">
          Discover and download{" "}
          <span className="text-foreground font-semibold">
            stunning wallpapers
          </span>{" "}
          for all your devices.
          <br className="hidden md:block" />
          From breathtaking nature shots to abstract art – find the perfect
          backdrop for your digital world.
        </p>

        {/* Enhanced CTA buttons */}
        <div className="flex flex-row gap-4 z-90">
          <Button size="lg" asChild>
            <Link href="/explore" className="group">
              <span className="flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base font-semibold border-2 hover:bg-foreground/5 transition-all duration-300 group-hover:scale-105"
            asChild
          >
            <Link
              href="https://github.com/cojocaru-david/wallpaper-pick"
              target="_blank"
              className="group"
            >
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Circular Gallery Section */}
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]" style={{ margin: 0, padding: 0 }}>
        <CircularGallery
          items={sampleWallpapers}
          bend={2}
          borderRadius={0.08}
        />
      </div>
    </div>
  );
}
