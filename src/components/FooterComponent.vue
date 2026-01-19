<template>
  <footer class="sm:mt-12 mb-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
    <div class="mt-2 space-x-2 flex justify-center items-center">
      <span>© 2025 - {{ currentYear }} Cola Copyright</span>
      <span class="mx-1 opacity-50">|</span>
      <a href="https://Ftianyu.cn" 
         target="_blank"
         class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ftianyu.cn</a>
      <template v-if="icpNumber">
        <span class="mx-1 opacity-50">|</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ icpNumber }}</a>
      </template>
    </div>
    <div class="mt-1 flex justify-center items-center text-xs opacity-80">
      <span class="mr-1">致谢:</span>
      <a href="https://github.com/JLinMr/Mini-Cover" target="_blank" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mini-Cover</a>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const icpNumber = import.meta.env.VITE_APP_ICP_NUMBER;
const currentYear = new Date().getFullYear();
</script>