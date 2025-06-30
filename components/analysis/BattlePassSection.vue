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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

<template>
  <UCard
    v-if="battlePassPackages?.length"
    class="mb-6 sm:mb-8"
  >
    <template #header>
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon
          name="i-heroicons-trophy"
          class="w-5 h-5 sm:w-6 sm:h-6"
        />
        Battle Pass
      </h2>
    </template>

    <!-- Mobile View: Stacked Cards -->
    <div class="block lg:hidden space-y-4">
      <div
        v-for="(pkg, index) in battlePassPackages"
        :key="index"
        class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="text-lg font-bold text-gray-900 dark:text-white">
            ${{ pkg.price.toFixed(2) }}
          </div>
          <div class="text-right">
            <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-purple-600 dark:text-purple-400 font-semibold'">
              {{ pkg.pullsFromPackage }} {{ gameData.metadata.pull.name.toLowerCase() }}s
            </div>
          </div>
        </div>
        <div class="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {{ formatBattlePassName(pkg.name) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">
          {{ pkg.totalAmount }} {{ gameData.metadata.currency.shortName.toLowerCase() }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {{ pkg.leftoverAmount }} leftover
        </div>
        <div
          v-if="pkg.description"
          class="text-xs text-purple-600 dark:text-purple-300 italic"
        >
          {{ pkg.description }}
        </div>
      </div>
    </div>

    <!-- Desktop View: Table Layout -->
    <div class="hidden lg:block">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-purple-200 dark:border-purple-800">
          <div class="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>Battle Pass Name</div>
            <div>Price</div>
            <div>{{ gameData.metadata.currency.shortName }}</div>
            <div>{{ gameData.metadata.pull.name }}s</div>
            <div>Leftover</div>
            <div>Description</div>
          </div>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="(pkg, index) in battlePassPackages"
            :key="index"
            class="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="grid grid-cols-6 gap-4 items-center">
              <div class="font-medium text-gray-900 dark:text-white">
                {{ formatBattlePassName(pkg.name) }}
              </div>
              <div class="font-semibold text-gray-900 dark:text-white">
                ${{ pkg.price.toFixed(2) }}
              </div>
              <div class="text-gray-600 dark:text-gray-300">
                {{ pkg.totalAmount.toLocaleString() }}
              </div>
              <div :class="pkg.pullsFromPackage === 0 ? 'text-red-500 font-medium' : 'text-purple-600 dark:text-purple-400 font-medium'">
                {{ pkg.pullsFromPackage }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ pkg.leftoverAmount }}
              </div>
              <div class="text-xs text-purple-600 dark:text-purple-300">
                {{ pkg.description || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Battle Pass Value Analysis -->
    <div
      v-if="battlePassAnalysis"
      class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-heroicons-calculator"
          class="w-4 h-4"
        />
        Battle Pass Value Analysis
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <UCard
          v-for="stat in battlePassStats"
          :key="stat.label"
          class="bg-purple-50 dark:bg-purple-900/20"
        >
          <div class="text-center p-2 sm:p-3">
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
              {{ stat.label }}
            </div>
            <div
              class="text-lg sm:text-xl font-bold break-words"
              :class="stat.color"
            >
              {{ stat.value }}
            </div>
            <div
              v-if="stat.explanation"
              class="text-xs text-gray-500 dark:text-gray-400 mt-1"
            >
              {{ stat.explanation }}
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { GameData, ProcessedPackage } from '~/types/games'

interface Props {
  gameData: GameData
  battlePassPackages: ProcessedPackage[]
}

const props = defineProps<Props>()

// Format battle pass names for better display
const formatBattlePassName = (name: string): string => {
  return name.trim()
}

// Battle pass analysis
const battlePassAnalysis = computed(() => {
  if (!props.battlePassPackages?.length) return null

  const validPackages = props.battlePassPackages.filter(pkg => pkg.pullsFromPackage > 0)
  if (!validPackages.length) return null

  return {
    bestValue: validPackages.reduce((best, pkg) =>
      pkg.costPerPull < best.costPerPull ? pkg : best,
    ),
    avgCostPerPull: validPackages.reduce((sum, pkg) => sum + pkg.costPerPull, 0) / validPackages.length,
    totalValue: validPackages.reduce((sum, pkg) => sum + pkg.price, 0),
    totalPulls: validPackages.reduce((sum, pkg) => sum + pkg.pullsFromPackage, 0),
    mostExpensive: validPackages.reduce((most, pkg) =>
      pkg.price > most.price ? pkg : most,
    ),
  }
})

const battlePassStats = computed(() => {
  if (!battlePassAnalysis.value) return []

  const formatValue = (value: number, prefix = '$') =>
    Number.isFinite(value) ? `${prefix}${value.toFixed(2)}` : 'N/A'

  return [
    {
      label: 'Best Value',
      value: formatBattlePassName(battlePassAnalysis.value.bestValue.name),
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: `Best Cost/${props.gameData.metadata.pull.name}`,
      value: formatValue(battlePassAnalysis.value.bestValue.costPerPull),
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Value',
      value: formatValue(battlePassAnalysis.value.totalValue),
      color: 'text-amber-600 dark:text-amber-400',
      explanation: 'Combined cost of all battle passes',
    },
    {
      label: `Total ${props.gameData.metadata.pull.name}s`,
      value: battlePassAnalysis.value.totalPulls.toString(),
      color: 'text-gray-900 dark:text-white',
      explanation: 'Total pulls from all battle passes',
    },
  ]
})
</script>
