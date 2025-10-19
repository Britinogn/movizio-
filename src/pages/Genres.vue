<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// State
const activeType = ref('movie'); // 'movie' or 'tv'
const genres = ref([]); // TMDB genres
const selectedGenre = ref(null); // Selected genre ID
const previews = ref([]); // TMDB previews for selected genre
const loading = ref(false); // For previews
const genresLoading = ref(false); // For genres
const error = ref(null);

// Computed for auth
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

// Fetch genres from TMDB
const fetchGenres = async () => {
  try {
    genresLoading.value = true;
    error.value = null;
    const endpoint = activeType.value === 'tv' ? '/genre/tv/list' : '/genre/movie/list';
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`);
    
    if (!response.ok) throw new Error('Failed to fetch genres');
    
    const data = await response.json();
    genres.value = data.genres || [];
    
    // Reset on type switch
    selectedGenre.value = null;
    previews.value = [];
    
    genresLoading.value = false;
  } catch (err) {
    console.error('Genres fetch error:', err);
    error.value = 'Failed to load genres. Please try again.';
    genres.value = [];
    genresLoading.value = false;
  }
};

// Fetch previews from TMDB for selected genre
const fetchPreviews = async (genreId) => {
  if (!genreId) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    const endpoint = activeType.value === 'tv' ? '/discover/tv' : '/discover/movie';
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1&with_genres=${genreId}&sort_by=popularity.desc`
    );
    
    if (!response.ok) throw new Error('Failed to fetch previews');
    
    const data = await response.json();
    previews.value = data.results?.slice(0, 12) || [];
    selectedGenre.value = genreId;
    loading.value = false;
  } catch (err) {
    console.error('Previews fetch error:', err);
    previews.value = [];
    error.value = 'Failed to load previews. Please try again.';
    loading.value = false;
  }
};

// Handle genre click
const handleGenreClick = (genre) => {
  if (selectedGenre.value === genre.id) return;
  fetchPreviews(genre.id);
};

// Navigate to detail
const goToDetail = (item) => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  router.push(`/detail/${activeType.value}/${item.id}`);
};

// Image error handler
const handleImageError = (event) => {
  event.target.src = '/img/placeholder-poster.jpg';
  event.target.alt = 'No image available';
};

// Watch type changes
watch(activeType, fetchGenres);

onMounted(() => {
  fetchGenres();
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0918] text-white pt-24 pb-12">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-6 mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        Explore Genres
      </h1>
      <p class="text-center text-gray-400 mb-6">Discover {{ activeType === 'movie' ? 'movies' : 'TV shows' }} by your favorite genres</p>
      <div class="flex justify-center mb-6">
        <button
          @click="activeType = 'movie'"
          :class="[
            'px-6 py-2 mr-4 rounded-full font-semibold transition-all duration-300',
            activeType === 'movie' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' : 'bg-[#181727]/50 border border-purple-500/30 hover:border-purple-500/50'
          ]"
        >
          Movies
        </button>
        <button
          @click="activeType = 'tv'"
          :class="[
            'px-6 py-2 rounded-full font-semibold transition-all duration-300',
            activeType === 'tv' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' : 'bg-[#181727]/50 border border-purple-500/30 hover:border-purple-500/50'
          ]"
        >
          TV Shows
        </button>
      </div>
    </div>

    <!-- Loading Genres -->
    <div v-if="genresLoading" class="flex justify-center items-center min-h-[50vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-lg">Loading genres...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error && !genres.length" class="max-w-7xl mx-auto px-6 text-center py-12">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-400 text-lg mb-4">{{ error }}</p>
        <button @click="fetchGenres" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300">
          Retry
        </button>
      </div>
    </div>

    <!-- Genres Horizontal Scroll -->
    <div v-else-if="genres.length" class="max-w-7xl mx-auto px-6 mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-300">Select a Genre</h2>
      <div class="relative">
        <div class="overflow-x-auto scrollbar-hide flex space-x-4 pb-4">
          <div v-for="genre in genres" :key="genre.id" class="flex-shrink-0">
            <button
              @click="handleGenreClick(genre)"
              :class="[
                'px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap',
                selectedGenre === genre.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg text-white scale-105'
                  : 'bg-[#181727]/50 border border-purple-500/30 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
        <!-- Fade indicator -->
        <div class="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#0a0918] to-transparent pointer-events-none"></div>
      </div>
    </div>

    <!-- Previews for Selected Genre -->
    <div v-if="selectedGenre" class="max-w-7xl mx-auto px-6 space-y-6">
      <!-- Category Header -->
      <div class="flex justify-between items-center flex-wrap gap-4">
        <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          {{ genres.find(g => g.id === selectedGenre)?.name }}
          <span class="text-gray-400 text-xl"> ({{ activeType === 'movie' ? 'Movies' : 'TV Shows' }})</span>
        </h2>
      </div>

      <!-- Loading Previews -->
      <div v-if="loading" class="flex justify-center items-center min-h-[40vh]">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-400 text-lg">Loading previews...</p>
        </div>
      </div>

      <!-- Previews Grid -->
      <div v-else-if="previews.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <div
          v-for="preview in previews"
          :key="preview.id"
          class="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          @click="goToDetail(preview)"
        >
          <div class="aspect-[2/3] relative">
            <img
              :src="preview.poster_path ? `${TMDB_IMAGE_BASE}${preview.poster_path}` : '/img/placeholder-poster.jpg'"
              :alt="`${preview.title || preview.name} poster`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <h3 class="font-bold text-sm mb-1 line-clamp-2">{{ preview.title || preview.name }}</h3>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-yellow-400 flex items-center gap-1">⭐ {{ preview.vote_average?.toFixed(1) || 'N/A' }}</span>
                  <span class="text-gray-300">{{ preview.release_date?.split('-')[0] || preview.first_air_date?.split('-')[0] || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Previews -->
      <div v-else-if="!loading" class="text-center py-12">
        <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p class="text-gray-400 text-lg mb-4">No previews available for this genre.</p>
          <button @click="fetchPreviews(selectedGenre)" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Default Open First Genre -->
    <div v-else-if="!genresLoading && genres.length && !selectedGenre" class="max-w-7xl mx-auto px-6 text-center py-12">
      <p class="text-gray-400 text-lg">Click a genre to explore {{ activeType === 'movie' ? 'movies' : 'TV shows' }}.</p>
    </div>
  </div>
</template>