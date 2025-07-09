/*
 * GachaScope - Comprehensive web application for analyzing cost-effectiveness of in-app purchase bundles in gacha games
 * Copyright (C) 2025  Sakan Nirattisaykul
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ title }}
    </h3>
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        class="px-4 py-3 border-b"
        :class="[headerBg, headerBorder]"
      >
        <div class="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          <div>Name</div>
          <div>Price</div>
          <div>{{ currencyName }}</div>
          <div>{{ pullName }}s</div>
          <div>Leftover</div>
        </div>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="(pkg, index) in packages"
          :key="index"
          class="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div class="grid grid-cols-5 gap-4 items-center">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ pkg.name }}
            </div>
            <div class="font-semibold text-gray-900 dark:text-white">
              ${{ pkg.price.toFixed(2) }}
            </div>
            <div class="text-gray-600 dark:text-gray-300">
              {{ pkg.totalAmount.toLocaleString() }}
            </div>
            <div :class="pkg.pullsFromPurchase === 0 ? 'text-red-500 font-medium' : textColor">
              {{ pkg.pullsFromPurchase }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ pkg.leftoverAmount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  packages: { type: Array, required: true },
  pullName: { type: String, required: true },
  currencyName: { type: String, required: true },
  title: { type: String, required: true },
  headerBg: { type: String, default: 'bg-gray-50 dark:bg-gray-900/20' },
  headerBorder: { type: String, default: 'border-gray-200 dark:border-gray-800' },
  textColor: { type: String, default: 'text-gray-900 dark:text-white' },
})
</script>
