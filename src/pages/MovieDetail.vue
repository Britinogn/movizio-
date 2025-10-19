<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TrailerModal from '../components/TrailerModal.vue';

const route = useRoute();
const router = useRouter();

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

// Reactive state
const type = ref(route.params.type || 'movie');
const id = ref(route.params.id);
const item = ref(null);
const credits = ref({ cast: [], crew: [] });
const videos = ref([]);
const recommendations = ref([]);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('overview');
const showTrailerModal = ref(false);

// Computed
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

const backdropUrl = computed(() => {
  return item.value?.backdrop_path 
    ? `${TMDB_IMAGE_BASE}w1280${item.value.backdrop_path}`
    : null;
});

const posterUrl = computed(() => {
  return item.value?.poster_path 
    ? `${TMDB_IMAGE_BASE}w500${item.value.poster_path}`
    : null;
});

const title = computed(() => {
  return item.value?.title || item.value?.name || 'Unknown';
});

const releaseYear = computed(() => {
  const date = item.value?.release_date || item.value?.first_air_date;
  return date ? new Date(date).getFullYear() : '';
});

const runtime = computed(() => {
  if (type.value === 'movie' && item.value?.runtime) {
    const hours = Math.floor(item.value.runtime / 60);
    const minutes = item.value.runtime % 60;
    return `${hours}h ${minutes}m`;
  }
  if (type.value === 'tv' && item.value?.episode_run_time?.length) {
    return `${item.value.episode_run_time[0]}m per episode`;
  }
  return '';
});

const trailerKey = computed(() => {
  const trailer = videos.value.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer?.key || (videos.value[0]?.site === 'YouTube' ? videos.value[0]?.key : null);
});

// Fetch all data
const fetchAllData = async () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    console.log('Fetching:', type.value, id.value);

    // Fetch main details
    const detailsRes = await fetch(
      `${TMDB_BASE_URL}/${type.value}/${id.value}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!detailsRes.ok) throw new Error(`Failed to fetch details: ${detailsRes.status}`);
    item.value = await detailsRes.json();

    // Fetch credits
    try {
      const creditsRes = await fetch(
        `${TMDB_BASE_URL}/${type.value}/${id.value}/credits?api_key=${TMDB_API_KEY}`
      );
      if (creditsRes.ok) {
        credits.value = await creditsRes.json();
      }
    } catch (err) {
      console.warn('Failed to load credits:', err);
    }

    // Fetch videos
    try {
      const videosRes = await fetch(
        `${TMDB_BASE_URL}/${type.value}/${id.value}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        videos.value = videosData.results || [];
      }
    } catch (err) {
      console.warn('Failed to load videos:', err);
    }

    // Fetch recommendations
    try {
      const recRes = await fetch(
        `${TMDB_BASE_URL}/${type.value}/${id.value}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      if (recRes.ok) {
        const recData = await recRes.json();
        recommendations.value = recData.results?.slice(0, 12) || [];
      }
    } catch (err) {
      console.warn('Failed to load recommendations:', err);
    }

    loading.value = false;
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.message || 'Failed to load details. Please try again.';
    loading.value = false;
  }
};

// Navigate to another detail
const goToDetail = (itemId) => {
  router.push(`/${type.value}/${itemId}`);
};

// Format date
const formatDate = (date) => {
  if (!date) return 'TBA';
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Image error handler
const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// Watch for route changes (when clicking recommendations)
watch(() => route.params.id, (newId) => {
  if (newId && newId !== id.value) {
    id.value = newId;
    type.value = route.params.type;
    window.scrollTo(0, 0); // Scroll to top
    fetchAllData();
  }
});

onMounted(() => {
  fetchAllData();
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0918] text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-lg">Loading details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen px-6">
      <div class="text-center max-w-md">
        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-400 text-lg mb-4">{{ error }}</p>
          <div class="flex gap-4 justify-center">
            <button 
              @click="fetchAllData" 
              class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300"
            >
              Retry
            </button>
            <button 
              @click="$router.go(-1)" 
              class="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="item" class="pb-12">
      <!-- Hero Section -->
      <div class="relative min-h-[70vh]">
        <!-- Backdrop -->
        <div v-if="backdropUrl" class="absolute inset-0 overflow-hidden">
          <img 
            :src="backdropUrl" 
            :alt="`${title} backdrop`"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0a0918] via-[#0a0918]/70 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#0a0918] via-transparent to-[#0a0918]/50"></div>
        </div>

        <!-- Back Button -->
        <div class="relative z-10 pt-24 px-6">
          <button 
            @click="$router.go(-1)"
            class="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-lg transition-all duration-300 mb-8"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-6 pt-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Poster -->
            <div v-if="posterUrl" class="flex-shrink-0">
              <img 
                :src="posterUrl"
                :alt="`${title} poster`"
                class="w-48 md:w-64 rounded-lg shadow-2xl"
                @error="handleImageError"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col justify-end">
              <h1 class="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {{ title }}
              </h1>
              
              <div class="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <span v-if="item.vote_average" class="flex items-center gap-1">
                  <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ item.vote_average.toFixed(1) }}/10
                </span>
                <span v-if="releaseYear">{{ releaseYear }}</span>
                <span v-if="runtime">{{ runtime }}</span>
                <span v-if="type === 'tv' && item.number_of_seasons">
                  {{ item.number_of_seasons }} Season{{ item.number_of_seasons > 1 ? 's' : '' }}
                </span>
              </div>

              <!-- Genres -->
              <div v-if="item.genres?.length" class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="genre in item.genres" 
                  :key="genre.id"
                  class="px-4 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm"
                >
                  {{ genre.name }}
                </span>
              </div>

              <!-- Tagline -->
              <p v-if="item.tagline" class="text-lg italic text-gray-400 mb-4">
                "{{ item.tagline }}"
              </p>

              <!-- Watch Trailer Button -->
              <div v-if="trailerKey" class="flex gap-4">
                <button 
                  @click="showTrailerModal = true"
                  class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="max-w-7xl mx-auto px-6 mt-12">
        <!-- Tab Navigation -->
        <div class="flex gap-4 border-b border-purple-500/30 mb-6">
          <button
            @click="activeTab = 'overview'"
            :class="[
              'px-6 py-3 font-semibold transition-all duration-300',
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Overview
          </button>
          <button
            v-if="credits?.cast?.length"
            @click="activeTab = 'cast'"
            :class="[
              'px-6 py-3 font-semibold transition-all duration-300',
              activeTab === 'cast'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Cast & Crew
          </button>
          <button
            v-if="videos.length > 0"
            @click="activeTab = 'videos'"
            :class="[
              'px-6 py-3 font-semibold transition-all duration-300',
              activeTab === 'videos'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Videos
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mb-12">
          <!-- Overview Tab -->
          <div v-show="activeTab === 'overview'" class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-3 text-purple-400">Overview</h2>
              <p class="text-gray-300 leading-relaxed text-lg">
                {{ item.overview || 'No overview available.' }}
              </p>
            </div>

            <!-- Additional Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div v-if="item.status" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Status</h3>
                <p class="text-lg font-semibold">{{ item.status }}</p>
              </div>
              <div v-if="item.release_date || item.first_air_date" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Release Date</h3>
                <p class="text-lg font-semibold">{{ formatDate(item.release_date || item.first_air_date) }}</p>
              </div>
              <div v-if="item.original_language" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Original Language</h3>
                <p class="text-lg font-semibold">{{ item.original_language.toUpperCase() }}</p>
              </div>
              <div v-if="type === 'movie' && item.budget && item.budget > 0" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Budget</h3>
                <p class="text-lg font-semibold">${{ item.budget.toLocaleString() }}</p>
              </div>
              <div v-if="type === 'movie' && item.revenue && item.revenue > 0" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Revenue</h3>
                <p class="text-lg font-semibold">${{ item.revenue.toLocaleString() }}</p>
              </div>
              <div v-if="item.production_companies?.length" class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20">
                <h3 class="text-sm text-gray-400 mb-1">Production</h3>
                <p class="text-sm font-semibold">{{ item.production_companies[0].name }}</p>
              </div>
            </div>
          </div>

          <!-- Cast Tab -->
          <div v-show="activeTab === 'cast'" class="space-y-8">
            <div v-if="credits?.cast?.length">
              <h2 class="text-2xl font-bold mb-4 text-purple-400">Cast</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div 
                  v-for="person in credits.cast.slice(0, 12)" 
                  :key="person.id"
                  class="text-center"
                >
                  <div class="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-[#181727]">
                    <img 
                      v-if="person.profile_path"
                      :src="`${TMDB_IMAGE_BASE}w185${person.profile_path}`"
                      :alt="person.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                      <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p class="font-semibold text-sm">{{ person.name }}</p>
                  <p class="text-xs text-gray-400">{{ person.character }}</p>
                </div>
              </div>
            </div>

            <div v-if="credits?.crew?.length">
              <h2 class="text-2xl font-bold mb-4 text-purple-400">Key Crew</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="person in credits.crew.slice(0, 9)" 
                  :key="`${person.id}-${person.job}`"
                  class="bg-[#181727]/50 p-4 rounded-lg border border-purple-500/20"
                >
                  <p class="font-semibold">{{ person.name }}</p>
                  <p class="text-sm text-gray-400">{{ person.job }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Videos Tab -->
          <div v-show="activeTab === 'videos'">
            <h2 class="text-2xl font-bold mb-4 text-purple-400">Videos & Trailers</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a 
                v-for="video in videos.slice(0, 6)" 
                :key="video.id"
                :href="`https://www.youtube.com/watch?v=${video.key}`"
                target="_blank"
                class="bg-[#181727]/50 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div class="relative aspect-video overflow-hidden">
                  <img 
                    :src="`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`"
                    :alt="video.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                    <svg class="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
                <div class="p-4">
                  <p class="font-semibold mb-1 line-clamp-1">{{ video.name }}</p>
                  <p class="text-sm text-gray-400">{{ video.type }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div v-if="recommendations.length" class="mb-12">
          <h2 class="text-2xl font-bold mb-6 text-purple-400">
            You May Also Like
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="rec in recommendations"
              :key="rec.id"
              class="group cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              @click="goToDetail(rec.id)"
            >
              <div class="aspect-[2/3] relative bg-[#181727]">
                <img 
                  v-if="rec.poster_path"
                  :src="`${TMDB_IMAGE_BASE}w500${rec.poster_path}`"
                  :alt="`${rec.title || rec.name} poster`"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <p class="font-bold text-sm line-clamp-2">{{ rec.title || rec.name }}</p>
                    <p v-if="rec.vote_average" class="text-xs text-yellow-400 mt-1">⭐ {{ rec.vote_average.toFixed(1) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Trailer Modal -->
    <TrailerModal 
      :show="showTrailerModal" 
      :trailer-key="trailerKey" 
      @close="showTrailerModal = false" 
    />

  </div>
</template>

<style scoped>
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