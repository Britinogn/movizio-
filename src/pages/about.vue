<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  window.scrollTo(0, 0);
});

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-[#0a0918] text-white pt-24 pb-16">
    <div class="max-w-6xl mx-auto px-6 space-y-16">
      
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
      >
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1 class="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to Movizio
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your ultimate destination for discovering movies and TV shows. Powered by the comprehensive 
          <span class="text-purple-400 font-semibold">TMDB API</span>.
        </p>
      </section>

      <!-- Vision Section -->
      <section class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-4">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p class="text-lg text-gray-300 leading-relaxed">
            We believe everyone deserves easy access to quality entertainment. Movizio simplifies movie discovery, 
            bringing you the latest releases, timeless classics, and everything in between.
          </p>
          <p class="text-lg text-gray-300 leading-relaxed">
            Whether you're searching for your next binge-worthy series or exploring hidden gems, 
            we've got you covered.
          </p>
        </div>
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <img
            src="https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
            alt="Cinema"
            class="relative rounded-xl shadow-2xl"
          />
        </div>
      </section>

      <!-- Features Grid -->
      <section class="space-y-8">
        <h2 class="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          What Makes Us Different
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div class="relative bg-[#0a0918] border border-purple-500/20 rounded-2xl p-8 space-y-4 hover:border-purple-500/40 transition-all">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Curated Collections</h3>
              <p class="text-gray-400 leading-relaxed">
                Browse carefully organized categories including trending, top-rated, upcoming releases, and genre-specific collections.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div class="relative bg-[#0a0918] border border-purple-500/20 rounded-2xl p-8 space-y-4 hover:border-purple-500/40 transition-all">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Beautiful Interface</h3>
              <p class="text-gray-400 leading-relaxed">
                Experience a sleek, modern design with smooth animations and an immersive dark theme that puts content first.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div class="relative bg-[#0a0918] border border-purple-500/20 rounded-2xl p-8 space-y-4 hover:border-purple-500/40 transition-all">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Real-Time Updates</h3>
              <p class="text-gray-400 leading-relaxed">
                Always stay current with live data from TMDB, including the latest ratings, cast info, and new releases.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="space-y-8">
        <h2 class="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Built With Modern Technology
        </h2>
        <div class="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-10">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <h3 class="text-xl font-bold text-purple-300">Frontend</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Vue.js 3 with Composition API
                </li>
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Tailwind CSS for styling
                </li>
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Vue Router for navigation
                </li>
              </ul>
            </div>
            <div class="space-y-3">
              <h3 class="text-xl font-bold text-pink-300">Data Source</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-pink-500 rounded-full"></span>
                  The Movie Database (TMDB) API
                </li>
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Real-time content updates
                </li>
                <li class="flex items-center gap-3">
                  <span class="w-2 h-2 bg-pink-500 rounded-full"></span>
                  High-quality images and metadata
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
        <div class="relative bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-2xl p-12 text-center space-y-6">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Start Exploring Today
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of movie enthusiasts discovering their next favorite film.
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="text-center space-y-6 pt-12 border-t border-purple-500/10">
        <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Movizio
        </h3>
        <p class="text-gray-400 max-w-md mx-auto">
          Bringing the world of cinema to your fingertips.
        </p>
        <div class="flex justify-center gap-6">
          <a 
            href="https://github.com/Britinogn" 
            target="_blank" 
            class="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
          </a>
          <a 
            href="https://www.themoviedb.org/" 
            target="_blank" 
            class="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
            </svg>
          </a>
          <a 
            href="https://www.linkedin.com/in/britinogn" 
            target="_blank" 
            class="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-500/50 transition-all"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }} <span class="text-purple-400 font-semibold">Movizio</span>. 
          Powered by TMDB API.
        </p>
      </footer>

    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>