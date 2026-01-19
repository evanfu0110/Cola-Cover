<template>
  <footer class="sm:mt-12 mb-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
    <div class="mt-2 space-x-2 flex justify-center items-center">
      <span>© 2025 - 至今 Cola Copyright</span>
      <span class="mx-1 opacity-50">|</span>
      <a href="https://Ftianyu.cn" 
         target="_blank"
         class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ftianyu.cn</a>
      <template v-if="icpNumber">
        <span class="mx-1 opacity-50">|</span>
        <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ icpNumber }}</a>
      </template>
    </div>
  </footer>
</template>

<script setup>
const icpNumber = import.meta.env.VITE_APP_ICP_NUMBER;
</script>