# Movizio

A modern movie and TV show discovery platform built with Vue 3 and Vite. Discover trending content, upcoming releases, top-rated films, and explore by genres with real-time data from TMDB (The Movie Database).

## 🎬 Features

- **Movie Discovery**: Browse trending, upcoming, and top-rated movies
- **TV Shows**: Explore TV series with detailed information
- **Genre Exploration**: Filter and discover content by genres
- **Detailed Pages**: Comprehensive movie and TV show detail pages
- **Trailer Modal**: Watch trailers directly in the app
- **User Authentication**: Sign in and sign up functionality
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Smooth Animations**: Enhanced user experience with GSAP animations
- **Carousel Components**: Interactive carousels for featured content

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Animations**: GSAP (GreenSock Animation Platform)
- **Carousels**: Swiper & Vue3 Carousel
- **Notifications**: Vue Toast Notification
- **API**: TMDB (The Movie Database)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🚀 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## 📁 Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and other assets
│   ├── components/  # Reusable Vue components
│   │   ├── footer.vue
│   │   ├── hero.vue
│   │   ├── navbar.vue
│   │   └── TrailerModal.vue
│   ├── pages/       # Route pages
│   │   ├── about.vue
│   │   ├── DiscoverMovies.vue
│   │   ├── Genres.vue
│   │   ├── GenresDetail.vue
│   │   ├── index.vue
│   │   ├── MovieDetail.vue
│   │   ├── signin.vue
│   │   ├── signup.vue
│   │   └── TvDetail.vue
│   ├── router/      # Vue Router configuration
│   ├── services/     # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── tmdb.js
│   ├── App.vue      # Root component
│   ├── main.js      # Application entry point
│   └── style.css    # Global styles
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## 🌐 Deployment

This project is configured for deployment on Vercel. The `vercel.json` file includes:
- SPA routing configuration
- Build command and output directory settings

To deploy:
1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy!

Live site: [https://movizio.vercel.app/](https://movizio.vercel.app/)

## 📝 License

This project is private and proprietary.

## 👤 Author

**Movizio Team**
- GitHub: [@Britinogn](https://github.com/Britinogn)
- LinkedIn: [britinogn](https://www.linkedin.com/in/britinogn)

---

Built with ❤️ using Vue 3 and Vite
