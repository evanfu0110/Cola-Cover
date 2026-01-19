<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm text-gray-600 dark:text-gray-400 font-medium">{{ label }}</label>
    <div class="flex items-center gap-2">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="updateValue($event.target.value)"
        class="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div class="flex items-center relative">
        <input
          type="number"
          :min="min"
          :max="max"
          :step="step"
          :value="modelValue"
          @input="updateValue($event.target.value)"
          class="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded focus:border-blue-500 focus:outline-none text-right pr-6"
        />
        <span class="absolute right-2 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
  label: String,
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Safe update
const updateValue = (val) => {
  emit('update:modelValue', Number(val));
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
