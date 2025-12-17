<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// State for preview content (only 10 items each)
const nowPlayingMovies = ref([]);
const tvSeries = ref([]);
const actionMovies = ref([]);
const upcomingMovies = ref([]);
const topRatedMovies = ref([]);
const trendingMovies = ref([]);
const loading = ref(true);

// Check if user is logged in
const isLoggedIn = ref(!!localStorage.getItem('token'));

// Fetch preview data from TMDB
const fetchPreviewContent = async () => {
  try {
    loading.value = true;

    // Now Playing Movies (10 items)
    const nowPlayingRes = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const nowPlayingData = await nowPlayingRes.json();
    nowPlayingMovies.value = nowPlayingData.results.slice(0, 10);

    // TV Series (10 items)
    const tvRes = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const tvData = await tvRes.json();
    tvSeries.value = tvData.results.slice(0, 10);

    // Action Movies (10 items)
    const actionRes = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US&page=1`
    );
    const actionData = await actionRes.json();
    actionMovies.value = actionData.results.slice(0, 10);

    // Upcoming Movies (10 items)
    const upcomingRes = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const upcomingData = await upcomingRes.json();
    upcomingMovies.value = upcomingData.results.slice(0, 10);

    // Top Rated Movies (10 items)
    const topRatedRes = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const topRatedData = await topRatedRes.json();
    topRatedMovies.value = topRatedData.results.slice(0, 10);

    // Trending Movies (10 items)
    const trendingRes = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    const trendingData = await trendingRes.json();
    trendingMovies.value = trendingData.results.slice(0, 10);

    loading.value = false;
  } catch (error) {
    console.error('Error fetching movies:', error);
    loading.value = false;
  }
};

// Handle Show More - redirect based on auth status
const handleShowMore = (route) => {
  if (isLoggedIn.value) {
    router.push(route);
  } else {
    // Show message or redirect to register
    router.push('/login');
  }
};

onMounted(() => {
  fetchPreviewContent();
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0918] text-white pt-24 pb-16">
    <!-- Hero Section for Non-Logged Users -->
    <div v-if="!isLoggedIn" class="max-w-7xl mx-auto px-6 mb-16">
      <div class="text-center space-y-6 py-12">
        <h1 class="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Unlimited Movies, TV Shows & More
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          Watch anywhere. Cancel anytime. Register now to get full access!
        </p>
        <div class="flex gap-4 justify-center pt-6">
          <router-link
            to="/register"
            class="px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-tr-2xl rounded-bl-2xl font-bold text-md hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
          >
            Get Started Now
          </router-link>
          <router-link
            to="/login"
            class="px-6 py-4 bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-tr-2xl rounded-bl-2xl font-bold text-md hover:bg-white/20 transition-all duration-300"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-lg">Loading awesome content...</p>
      </div>
    </div>

    <!-- Content Sections (Preview - 10 items each) -->
    <div v-else class="max-w-7xl mx-auto px-6 space-y-12">
      
      <!-- Now Playing Movies -->
      <section class="pt-16">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Now Playing
          </h2>
          <button
            @click="handleShowMore('/movies/now-playing')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button>
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="movie in nowPlayingMovies"
              :key="movie.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ movie.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <!-- Lock overlay for non-logged users -->
              <div v-if="!isLoggedIn" @click="router.push('/register')" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Click to Register</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TV Series -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            TV Series
          </h2>
          <!-- <button
            @click="handleShowMore('/tvseries')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button> -->
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="show in tvSeries"
              :key="show.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${show.poster_path}`"
                  :alt="show.name"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ show.name }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ show.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!isLoggedIn" @click="router.push('/register')" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Click to Register</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Movies -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Action Movies
          </h2>
          <!-- <button
            @click="handleShowMore('/movies/action')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button> -->
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="movie in actionMovies"
              :key="movie.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ movie.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!isLoggedIn" @click="router.push('/register')" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Click to Register</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Movies -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Upcoming
          </h2>
          <!-- <button
            @click="handleShowMore('/movies/upcoming')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button> -->
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="movie in upcomingMovies"
              :key="movie.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ movie.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!isLoggedIn" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Register to Watch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Top Rated Movies -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Top Rated
          </h2>
          <!-- <button
            @click="handleShowMore('/movies/top-rated')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button> -->
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="movie in topRatedMovies"
              :key="movie.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ movie.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!isLoggedIn" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Register to Watch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Now -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Trending Now
          </h2>
          <!-- <button
            @click="handleShowMore('/movies/trending')"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          >
            Show More
          </button> -->
        </div>
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 pb-4">
            <div
              v-for="movie in trendingMovies"
              :key="movie.id"
              class="flex-shrink-0 w-48 group cursor-pointer relative"
            >
              <div class="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img
                  :src="`${TMDB_IMAGE_BASE}${movie.poster_path}`"
                  :alt="movie.title"
                  class="w-full h-72 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 p-4">
                    <h3 class="font-bold text-sm mb-1">{{ movie.title }}</h3>
                    <p class="text-xs text-gray-300">⭐ {{ movie.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!isLoggedIn" class="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto mb-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-semibold">Register to Watch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- CTA Section for non-logged users -->
    <div v-if="!isLoggedIn" class="max-w-7xl mx-auto px-6 mt-16">
      <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
        <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Ready for Full Access?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Register now to unlock all movies, TV shows, and exclusive content!
        </p>
        <router-link
          to="/register"
          class="inline-block px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105"
        >
          Create Free Account
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>