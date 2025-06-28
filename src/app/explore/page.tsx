"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const wallpapers = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Wallpaper ${i + 1}`,
  image: `https://placehold.co/600x400?text=Wallpaper+${i + 1}`,
  downloads: 0,
}));

const filters = ["All", "Nature", "Abstract", "Minimal", "Tech"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modal, setModal] = useState<null | typeof wallpapers[0]>(null);

  const filteredWallpapers = wallpapers.filter(w =>
    (selectedFilter === "All" || w.name.includes(selectedFilter)) &&
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="w-full min-h-screen bg-background text-foreground flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">Explore Wallpapers</h1>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mb-8 items-center justify-between">
        <input
          type="text"
          placeholder="Search wallpapers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <Button
              key={f}
              variant={selectedFilter === f ? "default" : "outline"}
              onClick={() => setSelectedFilter(f)}
              size="sm"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {filteredWallpapers.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">No wallpapers found.</div>
        )}
        {filteredWallpapers.map(w => (
          <div
            key={w.id}
            className="group relative cursor-pointer rounded-xl overflow-hidden shadow bg-card hover:scale-105 transition-transform"
            onClick={() => setModal(w)}
          >
            <img src={w.image} alt={w.name} className="w-full h-40 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {w.name}
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md relative animate-in fade-in zoom-in">
            <button
              className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-foreground"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <img src={modal.image} alt={modal.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold mb-2">{modal.name}</h2>
            <div className="text-muted-foreground mb-4">Downloads: 0</div>
            <Button className="w-full">Download</Button>
          </div>
        </div>
      )}
    </main>
  );
} 