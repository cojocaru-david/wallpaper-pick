import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticSitemap, ...getComponentsSitemap()];
}

const staticSitemap: MetadataRoute.Sitemap = [
  {
    url: 'https://wallpaper-pick.vercel.app',
    lastModified: new Date("2025-06-27"),
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    url: 'https://wallpaper-pick.vercel.app/explore',
    lastModified: new Date("2025-06-27"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: 'https://wallpaper-pick.vercel.app/about',
    lastModified: new Date("2025-06-27"),
    changeFrequency: "monthly",
    priority: 0.9,
  }
];

function getComponentsSitemap(): MetadataRoute.Sitemap {
  const componentSitemap: MetadataRoute.Sitemap = [];
  
  return componentSitemap;
}