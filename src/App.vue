<template>
  <div 
    class="min-h-screen flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100 relative"
    :style="{ fontFamily: appFont }"
  >
    <!-- Global Decorative Background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-50 dark:opacity-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900"></div>
    <div class="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.05]"></div>

    <!-- Content -->
    <HeaderComponent class="relative z-10 py-4" />
    <CoverGenerator class="relative z-10 flex-1" />
    <FooterComponent class="relative z-10" />
  </div>
</template>

<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import CoverGenerator from './components/CoverGenerator.vue';
import FooterComponent from './components/FooterComponent.vue';
import { useDark } from './composables/useDark';
import { onMounted } from 'vue';

// Init Dark Mode
useDark();

// Global UI Font (Hardcoded as requested)
// Global UI Font
const appFont = import.meta.env.VITE_APP_FONT_FAMILY || 'sans-serif';
</script>

<style>
/* Force font inheritance for all elements to ensure UI font applies everywhere */
body, button, input, textarea, select {
  font-family: inherit;
}
</style>