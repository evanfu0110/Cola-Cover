<template>
    <header class="flex justify-between items-center px-6 py-4 max-w-[1600px] mx-auto w-full">
        <!-- Logo & 标题 -->
        <div class="flex items-center gap-3">
            <a href="https://Ftianyu.cn" target="_blank" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <!-- Logo -->
                <img src="/logo.svg" alt="Cola-Cover Logo" class="w-8 h-8 sm:w-10 sm:h-10" />
                <h1 class="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    <span class="sm:hidden">Cola Cover</span>
                    <span class="hidden sm:inline">Cola Cover | 高效博客封面制作</span>
                </h1>
            </a>
        </div>

        <!-- 右侧功能 -->
        <div class="flex items-center gap-4">
            <button 
                @click="toggleDark" 
                class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                title="Toggle Theme"
            >
                <!-- 亮色 -->
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                <!-- 暗色 -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <a href="https://github.com/evanfu0110/Cola-Cover" target="_blank" class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Source Code">
                <svg viewBox="0 0 16 16" width="24" height="24">
                    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </a>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';
import { useDark } from '../composables/useDark';

const { isDark, toggleDark } = useDark();
const title = 'Cola-Cover';
</script>