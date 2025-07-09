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
    v-if="!gameData"
    class="container mx-auto px-4 py-8"
  >
    <UAlert
      color="red"
      variant="solid"
    >
      <template #title>
        Game Not Found
      </template>
      <template #description>
        The game "{{ route.params.gameid }}" is not supported yet.
      </template>
    </UAlert>
  </div>

  <div
    v-else
    class="container mx-auto px-4 py-8 max-w-6xl"
  >
    <!-- Back Button -->
    <UButton
      variant="ghost"
      icon="i-heroicons-arrow-left"
      size="sm"
      class="mb-6"
      @click="navigateTo('/')"
    >
      <span class="hidden sm:inline">Back to Home</span>
      <span class="sm:hidden">Back</span>
    </UButton>

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ gameData.metadata.name }} In-App Purchase Analysis
      </h1>
      <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-base sm:text-lg">
        Compare {{ gameData.metadata.currency.name.toLowerCase() }} from in-app purchases to find the best value for your {{ gameData.metadata.pull.name.toLowerCase() }}s.
      </p>
    </div>

    <!-- Combined Value Analysis -->
    <CombinedValueAnalysis
      :game-data="gameData"
      :processed-purchases="processedPurchases"
    />

    <!-- Purchase Overview - Show All Purchases -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <UIcon
            name="i-heroicons-cube"
            class="w-5 h-5"
          />In-App Purchase Overview
        </h2>
      </template>

      <div class="space-y-6">
        <div
          v-for="(purchases, type) in filteredPurchases"
          :key="type"
          class="space-y-4"
        >
          <h3
            class="text-lg font-medium flex items-center gap-2"
            :class="getPurchaseTypeStyle(type).title"
          >
            <UIcon
              :name="getPurchaseTypeIcon(type)"
              class="w-4 h-4"
            />
            {{ getPurchaseTypeName(type) }}
          </h3>

          <!-- Mobile View: Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:hidden">
            <div
              v-for="pkg in purchases"
              :key="pkg.id"
              :class="[getPurchaseTypeStyle(type).card, 'p-3 rounded-lg']"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="text-sm font-bold text-gray-900 dark:text-white">
                  ${{ pkg.price.toFixed(2) }}
                </div>
                <div class="text-right">
                  <div :class="pkg.pullsFromPurchase === 0 ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-300'">
                    {{ pkg.pullsFromPurchase }} {{ gameData.metadata.pull.name.toLowerCase() }}s
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-300 mb-1">
                {{ pkg.totalAmount.toLocaleString() }} {{ gameData.metadata.currency.shortName.toLowerCase() }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {{ pkg.leftoverAmount }} leftover
              </div>
              <div
                class="text-xs font-medium"
                :class="getPurchaseTypeStyle(type).title"
              >
                {{ formatCostPerPull(pkg.costPerPull) }}
              </div>
            </div>
          </div>

          <!-- Desktop View: Table -->
          <div class="hidden lg:block">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div :class="[getPurchaseTypeStyle(type).card, 'px-4 py-3 border-b']">
                <div class="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div>In-App Purchase Name</div>
                  <div>Price</div>
                  <div>{{ gameData.metadata.currency.shortName }}</div>
                  <div>{{ gameData.metadata.pull.name }}s</div>
                  <div>Leftover</div>
                  <div>Cost per {{ gameData.metadata.pull.name }}</div>
                </div>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div
                  v-for="pkg in purchases"
                  :key="pkg.id"
                  class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div class="grid grid-cols-6 gap-4 items-center">
                    <div class="font-medium text-gray-900 dark:text-white text-sm">
                      {{ pkg.name }}
                    </div>
                    <div class="font-semibold text-gray-900 dark:text-white">
                      ${{ pkg.price.toFixed(2) }}
                    </div>
                    <div class="text-gray-600 dark:text-gray-300">
                      {{ pkg.totalAmount.toLocaleString() }}
                    </div>
                    <div :class="pkg.pullsFromPurchase === 0 ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white'">
                      {{ pkg.pullsFromPurchase }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ pkg.leftoverAmount }}
                    </div>
                    <div
                      class="font-medium"
                      :class="getPurchaseTypeStyle(type).title"
                    >
                      {{ formatCostPerPull(pkg.costPerPull) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Cost vs Pulls Chart -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cost vs {{ gameData.metadata.pull.name }}s
          </h3>
        </template>
        <div class="h-80 w-full">
          <Scatter
            :data="scatterChartData"
            :options="scatterChartOptions"
          />
        </div>
      </UCard>

      <!-- Efficiency Chart -->
      <UCard>
        <template #header>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Purchase Efficiency
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Cost per {{ gameData.metadata.pull.name.toLowerCase() }} - lower values indicate better efficiency
            </p>
          </div>
        </template>
        <div class="h-80 w-full">
          <Bar
            :data="barChartData"
            :options="barChartOptions"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Scatter } from 'vue-chartjs'
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'
import CombinedValueAnalysis from '~/components/analysis/CombinedValueAnalysis.vue'
import { useChartConfig } from '~/composables/useChartConfig'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const route = useRoute()
const { getProcessedPurchases, generateChartsFromPurchases } = useGameAnalysis()
const gameId = route.params.gameid
const gameData = ref(getGameById(gameId))

if (!gameData.value) {
  throw createError({ statusCode: 404, statusMessage: `Game "${gameId}" not found` })
}

useHead({
  title: `${gameData.value.metadata.name} Analysis`,
  meta: [
    {
      name: 'description',
      content: `${gameData.value.metadata.currency.name} purchase analysis for ${gameData.value.metadata.name}`,
    },
    {
      property: 'og:title',
      content: `${gameData.value.metadata.name} Analysis - GachaScope`,
    },
    {
      property: 'og:description',
      content: `Analyze ${gameData.value.metadata.currency.name} packages and optimize your spending in ${gameData.value.metadata.name}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:title',
      content: `${gameData.value.metadata.name} Analysis - GachaScope`,
    },
    {
      name: 'twitter:description',
      content: `Analyze ${gameData.value.metadata.currency.name} packages and optimize your spending in ${gameData.value.metadata.name}`,
    },
  ],
})

const processedPurchases = getProcessedPurchases(gameId)
if (!processedPurchases) {
  throw createError({ statusCode: 500, statusMessage: `Failed to process purchases for game "${gameId}"` })
}
const chartsData = generateChartsFromPurchases(processedPurchases)

// Filter out empty purchase types
const filteredPurchases = computed(() => {
  return Object.fromEntries(
    Object.entries(processedPurchases).filter(([_, purchases]) => purchases && purchases.length > 0),
  )
})

// Format cost per pull to handle infinity
const formatCostPerPull = (costPerPull: number): string => {
  if (!Number.isFinite(costPerPull) || costPerPull === Infinity) {
    return 'no warp for the cost'
  }
  return `$${costPerPull.toFixed(2)} per ${gameData.value.metadata.pull.name.toLowerCase()}`
}

// Purchase type styling
const purchaseTypeStyles = {
  normal: {
    card: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
    title: 'text-red-600 dark:text-red-400',
  },
  first_time_bonus: {
    card: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    title: 'text-green-600 dark:text-green-400',
  },
  subscription: {
    card: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    title: 'text-green-600 dark:text-green-400',
  },
  battle_pass: {
    card: 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800',
    title: 'text-purple-600 dark:text-purple-400',
  },
}

const purchaseTypeNames = {
  normal: 'Normal Oneiric Shard Purchase',
  first_time_bonus: 'First-Time Bonus Oneiric Shard Purchase',
  subscription: 'Subscription',
  battle_pass: 'Battle Pass',
}

const purchaseTypeIcons = {
  normal: 'i-heroicons-shopping-bag',
  first_time_bonus: 'i-heroicons-gift',
  subscription: 'i-heroicons-calendar',
  battle_pass: 'i-heroicons-trophy',
}

const getPurchaseTypeStyle = (type: string) => purchaseTypeStyles[type] || purchaseTypeStyles.normal
const getPurchaseTypeName = (type: string): string => purchaseTypeNames[type] || type
const getPurchaseTypeIcon = (type: string): string => purchaseTypeIcons[type] || 'i-heroicons-cube'

// Chart data and options
const { packageTypeColors, typeLabels, createChartOptions } = useChartConfig(gameData)

const scatterChartData = computed(() => {
  if (!chartsData) return { datasets: [] }

  const groupedData = chartsData.scatterData.reduce((acc, point) => {
    acc[point.type] = acc[point.type] || []
    acc[point.type].push({ x: point.x, y: point.y, purchaseName: point.purchaseName })
    return acc
  }, {})

  return {
    datasets: Object.entries(groupedData).map(([type, data]) => ({
      label: typeLabels[type] || type,
      data,
      backgroundColor: packageTypeColors[type]?.bg || 'rgba(156, 163, 175, 0.8)',
      borderColor: packageTypeColors[type]?.border || 'rgb(156, 163, 175)',
      pointRadius: 6,
    })),
  }
})

const barChartData = computed(() => {
  if (!chartsData?.barData) return { labels: [], datasets: [] }

  const allPurchaseNames = new Set()
  Object.values(chartsData.barData).forEach((purchases) => {
    purchases.forEach(purchase => allPurchaseNames.add(purchase.purchase))
  })

  const labels = Array.from(allPurchaseNames)
  const datasets = Object.entries(chartsData.barData).map(([type, purchases]) => ({
    label: typeLabels[type] || type,
    data: labels.map((label) => {
      const purchase = purchases.find(p => p.purchase === label)
      return purchase ? parseFloat(purchase.costPerPull.toFixed(2)) : null
    }),
    backgroundColor: packageTypeColors[type]?.bg || 'rgba(156, 163, 175, 0.7)',
    borderColor: packageTypeColors[type]?.border || 'rgb(156, 163, 175)',
    borderWidth: 1,
  }))

  return { labels, datasets }
})

const scatterChartOptions = computed(() => createChartOptions(true))
const barChartOptions = computed(() => createChartOptions(false))
</script>
