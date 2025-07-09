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
  <div
    v-if="pkg"
    class="p-4 rounded-lg border"
    :class="[bgColor, borderColor]"
  >
    <div class="flex justify-between items-start mb-2">
      <div class="text-lg font-bold text-gray-900 dark:text-white">
        ${{ pkg.price?.toFixed(2) || '0.00' }}
      </div>
      <div class="text-right">
        <div :class="[(pkg.pullsFromPurchase || 0) === 0 ? 'text-red-500' : textColor, 'font-medium']">
          {{ pkg.pullsFromPurchase || 0 }} {{ pullName.toLowerCase() }}s
        </div>
      </div>
    </div>
    <div class="text-sm font-medium text-gray-900 dark:text-white mb-2">
      {{ pkg.name || 'Unknown Purchase' }}
    </div>
    <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
      {{ pkg.totalAmount || 0 }} {{ currencyName.toLowerCase() }}
    </div>
    <div class="text-xs text-gray-500 dark:text-gray-400">
      {{ pkg.leftoverAmount || 0 }} leftover
    </div>
  </div>
  <div
    v-else
    class="p-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20"
  >
    <div class="text-red-600 dark:text-red-400 text-center">
      Purchase data unavailable
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProcessedPurchase } from '~/types/games'

interface Props {
  pkg: ProcessedPurchase | null
  pullName: string
  currencyName: string
  bgColor?: string
  borderColor?: string
  textColor?: string
}

withDefaults(defineProps<Props>(), {
  bgColor: 'bg-gray-50 dark:bg-gray-900/20',
  borderColor: 'border-gray-200 dark:border-gray-800',
  textColor: 'text-gray-900 dark:text-white',
})
</script>
