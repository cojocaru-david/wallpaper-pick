import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center ">

      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center w-full px-4 py-24 md:py-32 text-center gap-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 font-syne">
          Wallpaper Pick
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-2xl text-muted-foreground mb-6">
          Discover, preview, and download stunning high-quality wallpapers for your desktop and mobile. Curated collections, trending backgrounds, and easy downloads.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/explore">Explore Wallpapers</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="#features">Learn More</a>
          </Button>
        </div>
      </section>
      {/* One Page Scroll Info Blocks */}
      <section id="features" className="w-full flex flex-col items-center gap-16 py-16 px-4 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Curated Collections</h2>
            <p className="text-muted-foreground">Handpicked wallpapers for every taste and device, updated regularly.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Easy Downloads</h2>
            <p className="text-muted-foreground">Download wallpapers in one click, optimized for desktop and mobile.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Trending & New</h2>
            <p className="text-muted-foreground">Stay ahead with trending backgrounds and discover new favorites daily.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 w-full">
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Super Clean UI</h2>
            <p className="text-muted-foreground">Enjoy a distraction-free, modern, and responsive browsing experience.</p>
          </div>
          <div className="bg-card rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Dark Mode</h2>
            <p className="text-muted-foreground">Switch between light and dark themes for comfortable viewing anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
