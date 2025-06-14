<template>
  <div class="p-4 rounded-lg border" :class="[bgColor, borderColor]">
    <div class="flex justify-between items-start mb-2">
      <div class="text-lg font-bold text-gray-900 dark:text-white">${{ pkg.price.toFixed(2) }}</div>
      <div class="text-right">
        <div :class="[pkg.pullsFromPackage === 0 ? 'text-red-500' : textColor, 'font-medium']">
          {{ pkg.pullsFromPackage }} {{ pullName.toLowerCase() }}s
        </div>
      </div>
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
      {{ pkg.totalAmount }} {{ currencyName.toLowerCase() }}
    </div>
    <div class="text-xs text-gray-500 dark:text-gray-400">
      {{ pkg.leftoverAmount }} leftover
    </div>
  </div>
</template>

<script setup>
defineProps({
  pkg: { type: Object, required: true },
  pullName: { type: String, required: true },
  currencyName: { type: String, required: true },
  bgColor: { type: String, default: 'bg-gray-50 dark:bg-gray-900/20' },
  borderColor: { type: String, default: 'border-gray-200 dark:border-gray-800' },
  textColor: { type: String, default: 'text-gray-900 dark:text-white' }
})
</script>
