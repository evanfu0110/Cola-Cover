<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ label }}</label>
    <div class="flex gap-2 items-center">
      <div class="relative w-8 h-8 rounded-full shadow-sm border border-gray-200 dark:border-slate-600 overflow-hidden shrink-0">
        <input 
          type="color" 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 cursor-pointer"
        >
      </div>
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded focus:border-blue-500 focus:outline-none uppercase"
        maxlength="7"
      >
      <button 
        @click="openEyeDropper"
        class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
        title="吸管取色"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           <path d="m2 22 1 1h3l9-9a2 2 0 0 0 .73-2.73l-.73-.73a2 2 0 0 0-2.82 0l-.73.73-9 9Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '#000000'
  },
  label: String
});

const emit = defineEmits(['update:modelValue']);

const openEyeDropper = async () => {
  if (!window.EyeDropper) {
    alert('您的浏览器不支持取色器功能 (需要 Chrome 95+)');
    return;
  }
  
  try {
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    emit('update:modelValue', result.sRGBHex);
  } catch (e) {
    // User canceled
    console.log('EyeDropper canceled');
  }
};
</script>
