<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const isActive = ref(false);
const isScrolled = ref(false);
const authToken = ref(localStorage.getItem('token'));

// Check if user is logged in - now uses reactive authToken
const isLoggedIn = computed(() => {
  return !!authToken.value;
});

// Check if current page is home
const isHomePage = computed(() => {
  return route.path === '/';
});

const toggleMenu = () => (isActive.value = !isActive.value);
const closeMenu = () => (isActive.value = false);

const handleScroll = () => {
  isScrolled.value = window.scrollY >= 60;
};

// Function to check auth status
const checkAuthStatus = () => {
  authToken.value = localStorage.getItem('token');
};

// Logout function - now updates authToken
const logout = () => {
  localStorage.removeItem('token');
  authToken.value = null;
  closeMenu();
  router.push('/');
};

// Watch for route changes and update auth status
watch(() => route.path, () => {
  checkAuthStatus();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("storage", checkAuthStatus);
  // Check immediately on mount
  checkAuthStatus();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("storage", checkAuthStatus);
});
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out',
      isScrolled
        ? 'bg-[#0a0918]/95 backdrop-blur-md border-b border-purple-600/30 shadow-[0_4px_30px_rgba(168,85,247,0.25)]'
        : 'bg-gradient-to-b from-[#0a0918]/90 to-transparent'
    ]"
  >
    <div
      class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-10 md:py-5"
    >
      <!-- Logo with Cinematic Glow -->
      <router-link
        to="/"
        class="flex items-center space-x-3 group relative"
      >
        <img
          src="/img/moviziologo.png"
          alt="Movizio"
          class="w-[60px] md:w-[75px] transition-all duration-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] 
            group-hover:drop-shadow-[0_0_35px_rgba(236,72,153,0.7)] group-hover:scale-110"
        />
        <span
          class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-widest hidden sm:block"
        >
          MOVIZIO
        </span>
      </router-link>

      <!-- Desktop Nav -->
      <nav
        :class="[
          'absolute left-0 top-full w-full md:static md:w-auto md:bg-transparent text-white transition-all duration-500 ease-in-out',
          isActive
            ? 'max-h-96 opacity-100 visible bg-[#0a0918]/98 backdrop-blur-lg shadow-lg border-b border-purple-700/40'
            : 'max-h-0 opacity-0 invisible md:opacity-100 md:visible md:max-h-none'
        ]"
      >
        <ul
          class="flex flex-col md:flex-row md:items-center md:space-x-10 text-lg font-medium px-8 md:px-0 py-6 md:py-0"
        >
          <!-- Show navigation links ONLY when logged in -->
          <template v-if="isLoggedIn">
            <li
              v-for="link in [
                { name: 'Home', path: '/' },
                { name: 'Discover', path: '/discover' },
                { name: 'Genres', path: '/genres' },
                { name: 'About', path: '/about' }
              ]"
              :key="link.path"
              class="py-4 md:py-0 border-b border-purple-500/10 md:border-0"
            >
              <router-link
                :to="link.path"
                @click="closeMenu"
                class="block relative group text-gray-200 hover:text-white transition-all duration-300"
              >
                {{ link.name }}
                <span
                  class="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"
                ></span>
              </router-link>
            </li>
          </template>

          <!-- Show Sign In/Sign Up ONLY on Home Page when NOT logged in -->
          <template v-if="isHomePage && !isLoggedIn">
            <li class="pt-4 md:pt-0 border-b border-purple-500/10 md:border-0">
              <router-link
                to="/login"
                @click="closeMenu"
                class="block relative group text-gray-200 hover:text-white transition-all duration-300"
              >
                Sign Up
                <span
                  class="absolute bottom-0 left-0 w-0 h-[2px]  bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"
                ></span>
              </router-link>
            </li>

            <li class="pt-4 md:pt-0">
              <router-link
                to="/register"
                @click="closeMenu"
                class="relative inline-block font-semibold text-white px-6 py-2 rounded-full overflow-hidden group"
              >
                <span
                  class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"
                ></span>
                <span class="relative z-10">Get Started</span>
              </router-link>
            </li>
          </template>

          <!-- Show Logout button when logged in (on any page) -->
          <li v-if="isLoggedIn" class="pt-4 md:pt-0">
            <button
              @click="logout"
              class="relative inline-block font-semibold text-white px-6 py-2 rounded-full overflow-hidden group"
            >
              <span
                class="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-80 group-hover:opacity-100 blur-md transition-all duration-300"
              ></span>
              <span class="relative z-10">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Hamburger Menu -->
      <button
        class="nav-toggle-btn flex flex-col justify-center items-end space-y-1.5 md:hidden transition-transform z-10 p-2"
        :class="{ active: isActive }"
        @click="toggleMenu"
        type="button"
      >
        <span class="block w-7 h-[3px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300" />
        <span class="block w-5 h-[3px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300" />
        <span class="block w-7 h-[3px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav-toggle-btn.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
  width: 28px;
}
.nav-toggle-btn.active span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}
.nav-toggle-btn.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
  width: 28px;
}

.router-link-active {
  color: #c084fc;
}
.router-link-active span {
  width: 100%;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
}
</style>