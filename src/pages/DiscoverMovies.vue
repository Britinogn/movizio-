<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Reactive state
const searchQuery = ref('');
const contentType = ref('movie'); // 'movie' or 'tv'
const selectedGenre = ref('');
const sortBy = ref('popularity.desc');
const page = ref(1);
const totalPages = ref(0);
const results = ref([]);
const genres = ref([]);
const loading = ref(false);
const error = ref(null);

// Computed
const isLoggedIn = computed(() => !!localStorage.getItem('token'));

// Fetch genres
const fetchGenres = async () => {
  try {
    const endpoint = contentType.value === 'tv' ? 'tv' : 'movie';
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/${endpoint}/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    if (!response.ok) throw new Error('Failed to fetch genres');
    const data = await response.json();
    genres.value = data.genres || [];
  } catch (err) {
    console.error('Genres fetch error:', err);
    genres.value = [];
  }
};

// Fetch content (discover or search)
const fetchContent = async () => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    let url;
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: page.value.toString()
    });

    // If there's a search query, use search endpoint
    if (searchQuery.value.trim()) {
      url = contentType.value === 'tv' ? '/search/tv' : '/search/movie';
      params.append('query', searchQuery.value.trim());
    } else {
      // Otherwise use discover endpoint
      url = contentType.value === 'tv' ? '/discover/tv' : '/discover/movie';
      params.append('sort_by', sortBy.value);
      if (selectedGenre.value) {
        params.append('with_genres', selectedGenre.value);
      }
    }

    const response = await fetch(`${TMDB_BASE_URL}${url}?${params}`);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();

    // Append or replace results based on page
    if (page.value === 1) {
      results.value = data.results || [];
    } else {
      results.value = [...results.value, ...(data.results || [])];
    }
    
    totalPages.value = data.total_pages || 0;
    loading.value = false;
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = 'Failed to load content. Please try again.';
    loading.value = false;
  }
};

// Handle filter changes
const handleFilterChange = () => {
  page.value = 1; // Reset to page 1
  results.value = []; // Clear results
  fetchContent();
};

// Load more for pagination
const loadMore = () => {
  if (page.value < totalPages.value && !loading.value) {
    page.value++;
    fetchContent();
  }
};

// Navigate to detail page
const goToDetail = (item) => {
  router.push(`/${contentType.value}/${item.id}`);
};

// Image error handler
const handleImageError = (event) => {
  event.target.src = '/img/placeholder-poster.jpg';
  event.target.alt = 'No image available';
};

// Watch content type changes to refetch genres
watch(contentType, () => {
  fetchGenres();
  selectedGenre.value = ''; // Reset genre when switching type
  handleFilterChange();
});

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  fetchGenres();
  fetchContent();
});
</script>

<template>
  <div class="min-h-screen bg-[#0a0918] text-white pt-28 pb-12">
    <!-- Header with Filters -->
    <div class="max-w-7xl mx-auto px-6 mb-8">
      <h1
        class="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
      >
        Discover Content
      </h1>
      <p class="text-center text-gray-400 mb-8">
        Explore thousands of {{ contentType === 'movie' ? 'movies' : 'TV shows' }}
      </p>

      <!-- Content Type Toggle -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex rounded-lg bg-[#181727]/50 p-1 border border-purple-500/30">
          <button
            @click="contentType = 'movie'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              contentType === 'movie'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Movies
          </button>
          <button
            @click="contentType = 'tv'"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-all duration-300',
              contentType === 'tv'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            TV Shows
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="`Search for ${contentType === 'movie' ? 'movies' : 'TV shows'}...`"
            class="w-full px-6 py-4 pl-12 bg-[#181727]/90 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white placeholder-gray-400"
            @input="handleFilterChange"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Genre & Sort Filters (Only show when NOT searching) -->
      <div v-if="!searchQuery.trim()" class="flex flex-col md:flex-row gap-4">
        <select
          v-model="selectedGenre"
          class="flex-1 px-6 py-3 bg-[#181727]/90 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white"
          @change="handleFilterChange"
        >
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <select
          v-model="sortBy"
          class="flex-1 px-6 py-3 bg-[#181727]/90 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-white"
          @change="handleFilterChange"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest First</option>
          <option value="vote_count.desc">Most Voted</option>
        </select>
      </div>

      <!-- Active Filters Display -->
      <div v-if="selectedGenre || searchQuery.trim()" class="mt-4 flex flex-wrap gap-2">
        <span v-if="searchQuery.trim()" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm">
          Search: "{{ searchQuery }}"
          <button @click="searchQuery = ''; handleFilterChange()" class="hover:text-red-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </span>
        <span v-if="selectedGenre" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm">
          Genre: {{ genres.find(g => g.id.toString() === selectedGenre.toString())?.name }}
          <button @click="selectedGenre = ''; handleFilterChange()" class="hover:text-red-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && page === 1" class="flex justify-center items-center min-h-[50vh]">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-lg">Loading {{ contentType === 'movie' ? 'movies' : 'TV shows' }}...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-6 text-center py-12">
      <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-red-400 text-lg mb-4">{{ error }}</p>
        <button
          @click="handleFilterChange"
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Results Grid -->
    <div v-else class="max-w-7xl mx-auto px-6">
      <div v-if="results.length > 0">
        <!-- Results count -->
        <p class="text-gray-400 mb-4">
          Found {{ totalPages > 1 ? `${results.length}+ results` : `${results.length} results` }}
        </p>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
        >
          <div
            v-for="item in results"
            :key="item.id"
            class="group relative cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            @click="goToDetail(item)"
          >
            <div class="aspect-[2/3] relative bg-[#181727]">
              <img
                v-if="item.poster_path"
                :src="`${TMDB_IMAGE_BASE}${item.poster_path}`"
                :alt="`${item.title || item.name} poster`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                </svg>
              </div>

              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-3">
                  <h3 class="font-bold text-sm mb-1 line-clamp-2">{{ item.title || item.name }}</h3>
                  <div class="flex items-center justify-between text-xs">
                    <span v-if="item.vote_average" class="text-yellow-400 flex items-center gap-1">
                      ⭐ {{ item.vote_average.toFixed(1) }}
                    </span>
                    <span class="text-gray-300">
                      {{ (item.release_date || item.first_air_date)?.split('-')[0] || 'TBA' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Release Year Badge -->
              <div v-if="item.release_date || item.first_air_date" class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs">
                {{ (item.release_date || item.first_air_date).split('-')[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="page < totalPages" class="text-center mt-12">
          <button
            @click="loadMore"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Loading More...' : 'Load More' }}
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="!loading" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <svg class="w-20 h-20 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3 class="text-2xl font-bold text-gray-300 mb-2">No Results Found</h3>
          <p class="text-gray-400 mb-6">
            {{ searchQuery ? `No ${contentType === 'movie' ? 'movies' : 'TV shows'} found for "${searchQuery}"` : 'Try adjusting your filters' }}
          </p>
          <button
            @click="searchQuery = ''; selectedGenre = ''; handleFilterChange()"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>