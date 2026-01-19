<template>
  <main class="container mx-auto max-w-[1600px] p-4 flex flex-col lg:flex-row lg:flex-wrap justify-center items-start gap-5">
    
    <!-- Control Panel -->
    <div class="w-full lg:flex-[1.2] flex flex-col gap-2">
    
      <!-- Canvas Size -->
      <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">画布尺寸</label>
        <div class="flex gap-2">
           <button @click="setCanvasSize(1000, 500)" class="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300" :class="{'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium': state.canvasWidth===1000 && state.canvasHeight===500}">
             默认 (1000x500)
           </button>
           <button @click="setCanvasSize(730, 310)" class="flex-1 px-3 py-1.5 text-xs bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-600 dark:text-gray-300" :class="{'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium': state.canvasWidth===730 && state.canvasHeight===310}">
             Heo (730x310)
           </button>
        </div>
        <div class="flex gap-2 items-center">
            <input type="number" v-model.number="customW" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-gray-800 dark:text-gray-200 focus:border-blue-500" placeholder="W" @change="applyCustomSize"> 
            <span class="text-gray-400">x</span>
            <input type="number" v-model.number="customH" class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-gray-800 dark:text-gray-200 focus:border-blue-500" placeholder="H" @change="applyCustomSize">
        </div>
      </div>
      
      <!-- Background Settings -->
      <CollapsibleGroup title="背景设置">
        <div class="flex flex-col gap-3">
          <!-- Background Mode Selection -->
          <div class="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
             <button 
               v-for="mode in ['solid', 'gradient', 'icon']" 
               :key="mode"
               @click="state.bgMode = mode"
               class="flex-1 py-1.5 text-sm rounded-md transition-all font-medium"
               :class="state.bgMode === mode ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
             >
               {{ mode === 'solid' ? '纯色' : mode === 'gradient' ? '渐变' : '图标氛围' }}
             </button>
          </div>

          <!-- Solid Color Mode -->
          <div v-if="state.bgMode === 'solid'" class="flex flex-col gap-2">
            <ColorPicker label="背景颜色" v-model="state.bgColor" />
          </div>

          <!-- Smart Suggestions (Background) - Solid -->
          <div v-if="state.suggestions && state.suggestions.bg && state.bgMode === 'solid'" class="flex flex-col gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
             <span class="text-xs font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                智能推荐 (纯色)
             </span>
             <div class="flex gap-2 overflow-x-auto pb-1">
                <button 
                   v-for="color in state.suggestions.bg.solid" :key="color"
                   class="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm shrink-0"
                   :style="{ backgroundColor: color }"
                   @click="state.bgColor = color"
                   title="应用颜色"
                ></button>
             </div>
          </div>
          
           <!-- Smart Suggestions (Background) - Gradient -->
          <div v-if="state.suggestions && state.suggestions.bg && state.bgMode === 'gradient'" class="flex flex-col gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
             <span class="text-xs font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                智能推荐 (渐变)
             </span>
             <div class="flex gap-2 overflow-x-auto pb-1">
                 <button 
                   v-for="(grad, idx) in state.suggestions.bg.gradient" :key="idx"
                   class="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm shrink-0"
                   :style="{ background: `linear-gradient(${grad.angle}deg, ${grad.stops[0].color}, ${grad.stops[1].color})` }"
                   @click="state.bgGradient = JSON.parse(JSON.stringify(grad))"
                   title="应用渐变"
                ></button>
             </div>
          </div>
          
          <!-- Gradient Mode -->
          <div v-if="state.bgMode === 'gradient'">
            <GradientEditor v-model="state.bgGradient" />
          </div>

          <!-- Icon Atmosphere Mode -->
          <div v-if="state.bgMode === 'icon'" class="flex flex-col gap-3">
             <div class="p-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer relative group">
                <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleIconUpload">
                <span v-if="!state.bgIconUrl" class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400">点击上传图标以生成氛围背景</span>
                <span v-else class="text-sm text-blue-600 dark:text-blue-400">已上传图标，点击更换</span>
             </div>
             
             <!-- BG Iconify Input -->
             <div class="flex gap-2">
               <input 
                 v-model="state.bgIconName" 
                 placeholder="输入图标名称 (如 logos:vue)"
                 class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-800 dark:text-gray-200"
                 @change="loadBgIcon"
               >
               <a href="https://yesicon.app" target="_blank" class="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600">库</a>
             </div>

             <PrecisionSlider label="氛围模糊度" v-model="state.bgBlur" :min="0" :max="100" unit="px" />
          </div>

          <!-- Common BG Settings (Blur) for Solid/Image legacy -->
          <div v-if="state.bgMode === 'solid' || state.bgImageUrl">
             <!-- Legacy Image Upload for manual BG -->
             <div class="flex gap-2">
                <label class="btn-secondary flex-1 text-center cursor-pointer text-sm py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-600">
                  上传背景图
                  <input type="file" accept="image/*" class="hidden" @change="handleBgUpload">
                </label>
             </div>
             <PrecisionSlider v-if="state.bgImageUrl" label="背景模糊" v-model="state.bgBlur" :min="0" :max="50" unit="px" />
          </div>
        </div>
      </CollapsibleGroup>

      <!-- Glass Layer Settings -->
      <CollapsibleGroup title="高斯模糊 (Gaussian Blur)">
         <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">启用高斯模糊</span>
            <input type="checkbox" v-model="state.glassEnabled" class="w-5 h-5 accent-blue-600 rounded">
         </div>
         
         <div v-if="state.glassEnabled" class="flex flex-col gap-3 pl-2 border-l-2 border-blue-100 dark:border-blue-900">
            <PrecisionSlider label="模糊强度" v-model="state.glassBlur" :min="0" :max="100" unit="px" />
            <PrecisionSlider label="不透明度" v-model="state.glassOpacity" :min="0" :max="100" unit="%" />
            <ColorPicker label="叠加色调" v-model="state.glassTintColor" />
         </div>
      </CollapsibleGroup>


      <!-- Logo/Icon Settings -->
      <CollapsibleGroup title="图标 / Logo">
         <div class="flex flex-col gap-3">
            <!-- Iconify Search -->
            <div class="flex gap-2">
               <input 
                 v-model="state.iconName" 
                 placeholder="输入图标名称 (如 logos:vue)"
                 class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded focus:border-blue-500 dark:focus:border-blue-400 outline-none text-gray-800 dark:text-gray-200"
                 @change="loadIcon"
               >
               <a href="https://yesicon.app" target="_blank" class="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600">库</a>
            </div>

            <!-- Upload -->
            <div class="flex gap-2">
               <label class="flex-1 py-2 text-sm text-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  上传 Logo 图片
                  <input type="file" accept="image/*" class="hidden" @change="handleSquareUpload">
               </label>
            </div>

            <div v-if="state.squareImageUrl" class="flex flex-col gap-3 mt-2">
               <PrecisionSlider label="大小" v-model="state.squareSize" :min="50" :max="800" unit="px" />
               <PrecisionSlider label="旋转" v-model="state.rotation" :min="0" :max="360" unit="°" />
               
               <div class="grid grid-cols-2 gap-3">
                 <PrecisionSlider label="阴影强度" v-model="state.shadowStrength" :min="0" :max="100" />
                 <ColorPicker label="阴影颜色" v-model="state.shadowColor" />
               </div>

               <div class="grid grid-cols-2 gap-3">
                 <PrecisionSlider label="底板大小" v-model="state.iconBgSize" :min="0" :max="100" />
                 <ColorPicker label="底板颜色" v-model="state.iconColor" />
               </div>
            </div>
         </div>
      </CollapsibleGroup>

      <!-- Text Settings -->
      <CollapsibleGroup title="文字设置">
         <div class="flex flex-col gap-3">
            <textarea 
               v-model="state.text"
               rows="2"
               placeholder="输入标题文字"
               class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-y text-gray-800 dark:text-gray-200"
            ></textarea>
            
            <div class="grid grid-cols-2 gap-3">
               <!-- Text Fill Mode -->
               <div class="col-span-2 flex p-0.5 bg-gray-100 dark:bg-slate-700 rounded-lg">
                  <button 
                     @click="state.textMode = 'solid'"
                     class="flex-1 py-1 text-xs rounded transition-all font-medium"
                     :class="state.textMode === 'solid' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
                  >纯色</button>
                  <button 
                     @click="state.textMode = 'gradient'"
                     class="flex-1 py-1 text-xs rounded transition-all font-medium"
                     :class="state.textMode === 'gradient' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
                  >渐变</button>
               </div>
               
               <!-- Smart Suggestions (Text) -->
               <div v-if="state.suggestions && state.suggestions.text" class="col-span-2 flex flex-col gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                   <!-- Solid Suggestions -->
                   <div v-if="state.textMode === 'solid'" class="flex flex-col gap-2">
                      <span class="text-xs font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                          智能推荐 (纯色)
                       </span>
                      <div class="flex gap-2 overflow-x-auto">
                        <button 
                             v-for="color in state.suggestions.text.solid" :key="color"
                             class="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm shrink-0"
                             :style="{ backgroundColor: color }"
                             @click="state.textColor = color"
                          ></button>
                      </div>
                   </div>
                   <!-- Gradient Suggestions -->
                   <div v-if="state.textMode === 'gradient'" class="flex flex-col gap-2">
                      <span class="text-xs font-bold text-blue-600 dark:text-blue-300 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                          智能推荐 (渐变)
                       </span>
                       <div class="flex gap-2 overflow-x-auto">
                           <button 
                             v-for="(grad, idx) in state.suggestions.text.gradient" :key="idx"
                             class="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-600 shadow-sm shrink-0"
                             :style="{ background: `linear-gradient(${grad.angle}deg, ${grad.stops[0].color}, ${grad.stops[1].color})` }"
                             @click="state.textGradient = JSON.parse(JSON.stringify(grad))"
                          ></button>
                       </div>
                   </div>
               </div>

               <div class="col-span-2" v-if="state.textMode === 'solid'">
                  <ColorPicker label="文字颜色" v-model="state.textColor" />
               </div>
               <div class="col-span-2" v-if="state.textMode === 'gradient'">
                  <GradientEditor v-model="state.textGradient" />
               </div>
               
               <div class="flex flex-col gap-1 col-span-2">
                  <label class="text-sm font-medium text-gray-600 dark:text-gray-400">字体</label>
                  <select v-model="state.selectedFont" class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-gray-800 dark:text-gray-200">
                     <option v-for="font in defaultConfig.fontOptions" :key="font.value" :value="font.value">{{ font.label }}</option>
                  </select>
               </div>
            </div>

            <PrecisionSlider label="文字大小" v-model="state.textSize" :min="20" :max="400" unit="px" />
            
            <div class="grid grid-cols-2 gap-3">
               <PrecisionSlider label="行高" v-model="state.lineHeight" :min="0.5" :max="3" :step="0.1" />
               <PrecisionSlider label="立体深度" v-model="state.text3D" :min="0" :max="20" />
            </div>
         </div>
      </CollapsibleGroup>

      <!-- Watermark -->
      <CollapsibleGroup title="水印设置" :defaultOpen="false">
          <div class="flex flex-col gap-3">
             <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">启用水印</span>
                <input type="checkbox" v-model="state.showWatermark" class="w-5 h-5 accent-blue-600 rounded">
             </div>
             <input 
                v-if="state.showWatermark" 
               type="text" 
               v-model="state.watermark"
               class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-gray-800 dark:text-gray-200"
               placeholder="水印文字"
            >
            <ColorPicker v-if="state.showWatermark" label="水印颜色" v-model="state.watermarkColor" />
         </div>
      </CollapsibleGroup>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-2">
         <button @click="saveImage" class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            保存图片 (WebP)
         </button>
      </div>

    </div>

    <!-- Preview Area -->
    <div class="relative w-full lg:flex-[2] sticky top-4 self-start">
       <div class="bg-gray-100 dark:bg-slate-800 rounded-xl p-1 shadow-inner border border-gray-200 dark:border-slate-700 overflow-auto">
          <canvas 
            ref="mainCanvasRef"
            :width="state.canvasWidth"
            :height="state.canvasHeight"
            class="h-auto rounded-lg shadow-lg bg-white mx-auto max-w-full"
          ></canvas>
       </div>
       <div class="mt-2 text-center text-xs text-gray-400">
          预览画布 ({{ state.canvasWidth }}x{{ state.canvasHeight }})
       </div>
    </div>

  </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useCoverState } from '../composables/useCoverState';
import { defaultConfig } from '../config';

// UI Components
import CollapsibleGroup from './ui/CollapsibleGroup.vue';
import PrecisionSlider from './ui/PrecisionSlider.vue';
import ColorPicker from './ui/ColorPicker.vue';
import GradientEditor from './ui/GradientEditor.vue';

const { state, setMainCanvas, initCanvases, triggerUpdate, drawComposition, resizeCanvas } = useCoverState();

const mainCanvasRef = ref(null);
const customW = ref(1000);
const customH = ref(500);

const setCanvasSize = (w, h) => {
   customW.value = w;
   customH.value = h;
   applyCustomSize();
};

const applyCustomSize = () => {
   if (customW.value > 0 && customH.value > 0) {
      resizeCanvas(customW.value, customH.value);
   }
};

onMounted(() => {
  initCanvases(state.canvasWidth, state.canvasHeight);
  setMainCanvas(mainCanvasRef.value);
  triggerUpdate();
  
  // Load fonts
  defaultConfig.fontStyles.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
});

// File Handlers
const handleBgUpload = (e) => {
   const file = e.target.files[0];
   if (!file) return;
   const reader = new FileReader();
   reader.onload = (evt) => {
      state.bgImageUrl = evt.target.result;
      state.bgMode = 'solid'; // Or keep current?
   };
   reader.readAsDataURL(file);
};

const handleIconUpload = (e) => {
   const file = e.target.files[0];
   if (!file) return;
   const reader = new FileReader();
   reader.onload = (evt) => {
      state.bgIconUrl = evt.target.result;
      state.bgMode = 'icon';
      state.bgBlur = 20; // Auto set default blur for atmosphere
   };
   reader.readAsDataURL(file);
};

const handleSquareUpload = (e) => {
   const file = e.target.files[0];
   if (!file) return;
   const reader = new FileReader();
   reader.onload = (evt) => {
      state.squareImageUrl = evt.target.result;
   };
   reader.readAsDataURL(file);
};

const loadIcon = () => {
   if (!state.iconName) return;
   const url = `https://api.iconify.design/${state.iconName}.svg`;
   fetch(url)
     .then(r => r.blob())
     .then(blob => {
        const file = new File([blob], 'icon.svg', { type: 'image/svg+xml' });
        state.squareImageUrl = URL.createObjectURL(file);
        // Also auto-set bg icon if in icon mode?
        if (state.bgMode === 'icon') {
           state.bgIconUrl = state.squareImageUrl;
        }
     });
};

const loadBgIcon = () => {
   if (!state.bgIconName) return;
   const url = `https://api.iconify.design/${state.bgIconName}.svg`;
   fetch(url)
     .then(r => r.blob())
     .then(blob => {
        const file = new File([blob], 'icon.svg', { type: 'image/svg+xml' });
        state.bgIconUrl = URL.createObjectURL(file);
        state.bgMode = 'icon';
        if (state.bgBlur === 0) state.bgBlur = 20;
     });
};



const saveImage = () => {
   const canvas = mainCanvasRef.value;
   if (!canvas) return;
   canvas.toBlob(blob => {
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = `cover-${Date.now()}.webp`;
       link.click();
   }, 'image/webp');
};
</script>

<style scoped>
.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}
</style>