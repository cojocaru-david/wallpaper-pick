export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://wallpaper-pick.vercel.app/sitemap.xml',
  };
}