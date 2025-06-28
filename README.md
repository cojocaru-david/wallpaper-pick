# 🎨 Wallpaper Pick

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</div>

<br />

<div align="center">
  <h3>🌟 Discover, preview, and download stunning high-quality wallpapers for your desktop and mobile devices</h3>
  <p>A modern, responsive wallpaper gallery built with Next.js 15, featuring beautiful animations and an immersive user experience.</p>
</div>

<div align="center">
  <a href="https://wallpaper-pick.vercel.app">🚀 Live Demo</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-getting-started">🛠️ Getting Started</a> •
  <a href="#-contributing">🤝 Contributing</a>
</div>

---

## 📸 Screenshots

<div align="center">
  <img src="https://i.imgur.com/s05OCBo.png" alt="Hero Section" width="400">
</div>

## ✨ Features

### 🎯 Core Features
- **📱 Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **🌙 Dark/Light Mode** - Seamless theme switching with smooth animations
- **🔍 Search & Filter** - Find wallpapers by category and search terms
- **📥 Easy Downloads** - One-click wallpaper downloads
- **⚡ Fast Performance** - Built with Next.js 15 and optimized for speed

### 🎨 Interactive Components
- **🌀 Circular Gallery** - Stunning 3D circular wallpaper gallery using WebGL
- **✨ Morphing Text** - Animated text transitions on the hero section
- **🎭 Static Noise Effect** - Subtle animated noise overlay for visual depth
- **🌈 Gradient Cards** - Interactive cards with mouse-following gradients
- **📊 GitHub Stars** - Real-time GitHub star counter with animations

### 🎪 Animation & Effects
- **Motion Framework** - Smooth animations powered by Motion (Framer Motion)
- **Interactive Hover Effects** - Responsive UI elements with delightful interactions
- **Loading States** - Custom circular spinner loader
- **Gradient Animations** - Dynamic color transitions and effects

### 🛠️ Technical Features
- **🔒 Security Headers** - CSP, HSTS, and other security measures
- **🔍 SEO Optimized** - Meta tags, sitemap, and robots.txt
- **📊 Analytics Ready** - Structured for easy analytics integration
- **🎨 Component Library** - Modular, reusable components
- **⚡ Modern Stack** - Latest React 19, Next.js 15, TypeScript 5

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.3.4 with App Router
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with custom design system
- **Animations:** Motion (Framer Motion) 12.19.2
- **3D Graphics:** OGL (WebGL library) 1.0.11

### UI Components
- **Base:** Custom components with Radix UI primitives
- **Design System:** shadcn/ui components (New York style)
- **Icons:** Lucide React + Tabler Icons
- **Theming:** next-themes for dark/light mode

### Development Tools
- **Linting:** ESLint with Next.js config
- **Styling:** PostCSS with Tailwind CSS
- **Package Manager:** npm
- **Build Tool:** Turbopack (Next.js bundler)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cojocaru-david/wallpaper-pick.git
   cd wallpaper-pick
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🎨 Key Components

### CircularGallery
A stunning 3D circular wallpaper gallery built with WebGL (OGL library):
- **Interactive rotation** with mouse/touch controls
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Optimized performance** with efficient rendering

### MorphingText
Animated text component with smooth morphing transitions:
- **Multiple text animations** with timing controls
- **Mobile optimization** with reduced effects
- **Blur and opacity transitions** for smooth morphing

### Theme System
Comprehensive dark/light mode implementation:
- **System preference detection**
- **Smooth color transitions**
- **CSS custom properties** for consistent theming
- **Persistent user preference**

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
```env
# Add any environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Tailwind CSS
The project uses Tailwind CSS 4 with custom design tokens defined in `globals.css`:
- Custom color palette with CSS variables
- Dark/light mode variants
- Responsive breakpoints
- Animation keyframes

### Next.js Configuration
Key configurations in `next.config.ts`:
- **Security headers** (CSP, HSTS)
- **Image optimization** with remote patterns
- **Standalone output** for deployment

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the code style
4. **Test your changes** thoroughly
5. **Submit a pull request**

### Guidelines
- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

### Issues
- 🐛 **Bug reports**: Use the bug report template
- 💡 **Feature requests**: Use the feature request template
- 📖 **Documentation**: Help improve our docs
- 🎨 **Design**: UI/UX improvements welcome

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful component library
- **Unsplash** for providing sample wallpaper images
- **Motion (Framer Motion)** for smooth animations
- **OGL** for WebGL utilities

## 📊 Stats

<div align="center">
  <img src="https://img.shields.io/github/stars/cojocaru-david/wallpaper-pick?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/cojocaru-david/wallpaper-pick?style=social" alt="GitHub forks">
  <img src="https://img.shields.io/github/issues/cojocaru-david/wallpaper-pick" alt="GitHub issues">
  <img src="https://img.shields.io/github/license/cojocaru-david/wallpaper-pick" alt="License">
</div>

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/cojocaru-david">David Cojocaru</a></p>
  <p>If you found this project helpful, please give it a ⭐️</p>
</div>
