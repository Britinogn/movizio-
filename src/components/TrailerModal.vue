<script setup>
import { watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  trailerKey: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

// Handle body scroll
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

// Handle ESC key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    closeModal();
  }
};

// Add/remove event listener
watch(() => props.show, (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleEscape);
  } else {
    window.removeEventListener('keydown', handleEscape);
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Animated Background Overlay -->
        <div class="absolute inset-0 bg-black/95 backdrop-blur-xl"></div>
        
        <!-- Animated Gradient Border Effect -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        </div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-4xl modal-content">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute -top-16 right-0 z-10 group"
            aria-label="Close trailer"
          >
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div class="relative flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span class="text-white font-medium text-sm">Close</span>
              </div>
            </div>
          </button>

          <!-- Video Container with Glow Effect -->
          <div class="relative">
            <!-- Glow Effect -->
            <div class="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-2xl opacity-30 animate-pulse-slow"></div>
            
            <!-- Video Frame -->
            <div class="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-2 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <div class="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style="padding-bottom: 56.25%;">
                <iframe
                  :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&color=white`"
                  class="absolute inset-0 w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Hint Text with Animation -->
          <div class="text-center mt-6 animate-fade-in-up">
            <p class="text-gray-300 text-sm flex items-center justify-center gap-3">
              <span class="flex items-center gap-2">
                <kbd class="px-3 py-1.5 bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-lg text-xs font-mono text-white shadow-lg">ESC</kbd>
                <span>or click outside to close</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Enhanced Modal Fade Animation */
.modal-fade-enter-active {
  animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-leave-active {
  animation: modalFadeOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Modal Content Animation */
.modal-content {
  animation: modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Pulse Animation for Glow */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Fade in up animation for hint text */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Keyboard key styling */
kbd {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}
</style>