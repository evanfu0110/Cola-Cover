<template>
  <div class="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
    <!-- Gradient Type & Angle -->
    <div class="flex gap-2 mb-2">
       <button 
         @click="gradient.type = 'linear'" 
         class="flex-1 text-xs py-1 rounded border transition-colors font-medium"
         :class="gradient.type === 'linear' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300' : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'"
       >线性渐变</button>
       <button 
         @click="gradient.type = 'radial'" 
         class="flex-1 text-xs py-1 rounded border transition-colors font-medium"
         :class="gradient.type === 'radial' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300' : 'bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'"
       >径向渐变</button>
    </div>

    <div v-if="gradient.type === 'linear'" class="flex items-center gap-2 mb-3">
       <span class="text-xs font-medium text-gray-500 dark:text-gray-400">角度</span>
       <input type="range" v-model.number="gradient.angle" min="0" max="360" class="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
       <span class="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{{ gradient.angle }}°</span>
    </div>

    <!-- Preview Bar -->
    <div 
      class="h-10 w-full rounded border border-gray-300 dark:border-slate-600 relative cursor-pointer shadow-inner"
      :style="{ background: previewBackground }"
      @click.self="addStop"
      title="点击添加颜色节点"
    >
      <!-- Stops -->
      <div 
        v-for="(stop, index) in gradient.stops" 
        :key="index"
        class="absolute top-0 bottom-0 w-4 -ml-2 cursor-pointer group flex items-center justify-center transition-all"
        :style="{ left: stop.offset + '%' }"
        @mousedown="activeStop = index"
      >
        <div 
           class="w-4 h-4 rounded-full border-2 shadow-sm transition-transform group-hover:scale-110"
           :class="activeStop === index ? 'border-blue-500 scale-125 z-10' : 'border-white dark:border-gray-600 z-0'"
           :style="{ backgroundColor: stop.color }"
        ></div>
      </div>
    </div>

    <!-- Stop Editor -->
    <div class="flex flex-col gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-gray-100 dark:border-slate-700" v-if="activeStop !== null && gradient.stops[activeStop]">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-gray-600 dark:text-gray-300">节点 {{ activeStop + 1 }}</span>
        <div class="flex gap-2">
            <button 
              @click="removeStop(activeStop)"
              class="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="gradient.stops.length <= 2"
            >删除节点</button>
        </div>
      </div>
      <div class="flex gap-2 items-center">
         <span class="text-xs text-gray-400 w-8">位置</span>
         <input 
           type="range"
           v-model.number="gradient.stops[activeStop].offset"
           min="0" max="100"
           class="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
         />
         <input 
           type="number" 
           v-model.number="gradient.stops[activeStop].offset"
           min="0" max="100"
           class="w-12 px-1 py-0.5 text-xs border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded text-center"
         />
      </div>
       <div class="flex gap-2 items-center">
         <span class="text-xs text-gray-400 w-8">颜色</span>
         <ColorPicker 
           v-model="gradient.stops[activeStop].color"
           class="flex-1"
         />
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ColorPicker from './ColorPicker.vue';

const props = defineProps({
  modelValue: {
    type: Object, // { type, angle, stops: [{offset, color}] }
    required: true
  }
});

const gradient = computed(() => props.modelValue);
const activeStop = ref(0);

const previewBackground = computed(() => {
  const sorted = [...gradient.value.stops].sort((a, b) => a.offset - b.offset);
  const stopsStr = sorted.map(s => `${s.color} ${s.offset}%`).join(', ');
  return `linear-gradient(90deg, ${stopsStr})`;
});

const addStop = (e) => {
  const rect = e.target.getBoundingClientRect();
  const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
  gradient.value.stops.push({ offset: percent, color: '#ffffff' });
  gradient.value.stops.sort((a, b) => a.offset - b.offset);
  activeStop.value = gradient.value.stops.findIndex(s => s.offset === percent);
};

const removeStop = (index) => {
  if (gradient.value.stops.length <= 2) return;
  gradient.value.stops.splice(index, 1);
  activeStop.value = Math.max(0, index - 1);
};
</script>
