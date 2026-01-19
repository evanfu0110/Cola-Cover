<template>
  <div class="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 mb-2 shadow-sm">
    <button 
      @click="isOpen = !isOpen"
      class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
      :class="{ 'border-b border-gray-100 dark:border-slate-700': isOpen }"
    >
      <span class="font-bold text-gray-700 dark:text-gray-200">{{ title }}</span>
      <svg 
        class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <div 
      v-show="isOpen"
      class="p-4 bg-white dark:bg-slate-800"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: String,
  defaultOpen: {
    type: Boolean,
    default: true
  }
});

const isOpen = ref(props.defaultOpen);
</script>
