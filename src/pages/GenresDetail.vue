<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMAGE_BACKDROP = 'https://image.tmdb.org/t/p/original';

// State
const type = ref(route.params.type); // 'movie' or 'tv'
const id = ref(route.params.id);
const details = ref(null);
const loading = ref(true);
const error = ref(null);
const credits = ref(null); // For cast/crew
const recommendations = ref([]);

// Computed for auth
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

// Fetch details
const fetchDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const endpoint = type.value === 'tv' ? `/tv/${id.value}` : `/movie/${id.value}`;
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (!response.ok) throw new Error('Failed to fetch details');
    
    const data = await response.json();
    details.value = data;
    
    // Fetch credits
    await fetchCredits();
    
    // Fetch recommendations
    await fetchRecommendations();
    
    loading.value = false;
  } catch (err) {
    console.error('Details fetch error:', err);
    error.value = 'Failed to load details. Please try again.';
    loading.value = false;
  }
};

// Fetch credits (cast)
const fetchCredits = async () => {
  try {
    const endpoint = type.value === 'tv' ? `/tv/${id.value}/credits` : `/movie/${id.value}/credits`;
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    if (response.ok) {
      const data = await response.json();
      credits.value = data.cast?.slice(0, 10) || [];
    }
  } catch (err) {
    console.error('Credits fetch error:', err);
  }
};

// Fetch recommendations
const fetchRecommendations = async () => {
  try {
    const endpoint = type.value === 'tv' ? `/tv/${id.value}/recommendations` : `/movie/${id.value}/recommendations`;
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      recommendations.value = data.results?.slice(0, 8) || [];
    }
  } catch (err) {
    console.error('Recommendations fetch error:', err);
  }
};

// Navigate back
const goBack = () => {
  router.go(-1);
};

// Navigate to detail (recursive, but for recs)
const goToDetail = (item) => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  router.push(`/detail/${type.value === 'tv' ? 'tv' : 'movie'}/${item.id}`);
};

// Image error handler
const handleImageError = (event) => {
  event.target.src = '/img/placeholder-poster.jpg';
  event.target.alt = 'No image available';
};

onMounted(() => {
  if (!type.value || !id.value) {
    error.value = 'Invalid route parameters.';
    loading.value = false;
    return;
  }
  fetchDetails();
});
</script>

<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-[#0a0918] flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-300 mb-4">Please log in to view details</h2>
      <button @click="router.push('/login')" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300">
        Go to Login
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#0a0918] text-white pt-24 pb-12">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-lg">Loading details...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-6 text-center py-12">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-400 text-lg mb-4">{{ error }}</p>
        <button @click="fetchDetails" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300">
          Retry
        </button>
      </div>
    </div>

    <!-- Details -->
    <div v-else-if="details" class="max-w-7xl mx-auto px-6 space-y-8">
      <!-- Back Button -->
      <button @click="goBack" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <!-- Hero Section -->
      <div class="relative">
        <div
          :style="{ backgroundImage: `url(${details.backdrop_path ? `${TMDB_IMAGE_BACKDROP}${details.backdrop_path}` : '/img/placeholder-backdrop.jpg'})` }"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 blur-sm"
        ></div>
        <div class="relative bg-black/60 backdrop-blur-sm rounded-xl p-8">
          <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div class="flex-shrink-0">
              <img
                :src="details.poster_path ? `${TMDB_IMAGE_BASE}${details.poster_path}` : '/img/placeholder-poster.jpg'"
                :alt="`${details.title || details.name} poster`"
                class="w-48 md:w-64 rounded-lg shadow-2xl"
                @error="handleImageError"
              />
            </div>
            <div class="flex-1 space-y-4">
              <h1 class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {{ details.title || details.name }}
              </h1>
              <div class="flex flex-wrap gap-2 text-sm text-gray-300">
                <span v-if="details.release_date || details.first_air_date">
                  {{ details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0] }}
                </span>
                <span v-if="type === 'movie' && details.runtime" class="px-2 py-1 bg-purple-600/30 rounded-full">
                  {{ Math.floor(details.runtime / 60) }}h {{ details.runtime % 60 }}m
                </span>
                <span v-if="type === 'tv' && details.number_of_seasons" class="px-2 py-1 bg-purple-600/30 rounded-full">
                  {{ details.number_of_seasons }} Seasons
                </span>
                <span class="flex items-center gap-1">
                  ⭐ {{ details.vote_average?.toFixed(1) || 'N/A' }}
                </span>
              </div>
              <p class="text-gray-300 leading-relaxed">{{ details.overview || 'No overview available.' }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="genre in (details.genres || [])" :key="genre.id" class="px-3 py-1 bg-purple-600/30 rounded-full text-sm">
                  {{ genre.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast Section -->
      <div v-if="credits && credits.length" class="space-y-4">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          Top Cast
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          <div
            v-for="cast in credits"
            :key="cast.id"
            class="text-center group cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img
              :src="cast.profile_path ? `${TMDB_IMAGE_BASE}${cast.profile_path}` : '/img/placeholder-profile.jpg'"
              :alt="cast.name"
              class="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-2 shadow-lg group-hover:shadow-purple-500/50"
              @error="handleImageError"
            />
            <p class="text-sm font-semibold text-gray-300 line-clamp-1">{{ cast.name }}</p>
            <p class="text-xs text-gray-500 line-clamp-1">{{ cast.character }}</p>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length" class="space-y-4">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Recommendations
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          <div
            v-for="rec in recommendations"
            :key="rec.id"
            class="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            @click="goToDetail(rec)"
          >
            <div class="aspect-[2/3] relative">
              <img
                :src="rec.poster_path ? `${TMDB_IMAGE_BASE}${rec.poster_path}` : '/img/placeholder-poster.jpg'"
                :alt="`${rec.title || rec.name} poster`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="font-bold text-sm mb-1 line-clamp-2">{{ rec.title || rec.name }}</h3>
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-yellow-400 flex items-center gap-1">⭐ {{ rec.vote_average?.toFixed(1) || 'N/A' }}</span>
                    <span class="text-gray-300">{{ rec.release_date?.split('-')[0] || rec.first_air_date?.split('-')[0] || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>