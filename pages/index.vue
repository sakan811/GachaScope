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
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              GachaScope
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate analysis tool for gacha game in-app purchases.
            Make informed spending decisions with detailed cost breakdowns and efficiency analysis.
          </p>
        </div>
      </div>
    </section>

    <!-- Supported Games Section -->
    <section
      id="games"
      class="py-20"
      data-testid="games-section"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supported Games
          </h2>
        </div>

        <div
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="games-grid"
        >
          <UCard
            v-for="game in supportedGames"
            :key="game.metadata.id"
            :class="[
              'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg',
              'border-2 hover:border-green-500 dark:hover:border-green-400',
            ]"
            :data-testid="`game-card-${game.metadata.id}`"
            @click="navigateToGame(game.metadata.id)"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ game.metadata.name }}
                    </h3>
                  </div>
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getActiveGames } from '~/utils/gameRegistry'

// Set page meta
useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'GachaScope - The ultimate analysis tool for gacha game in-app purchases. Optimize your spending across multiple games.' },
  ],
})

// Get all supported games
const supportedGames = getActiveGames()

function navigateToGame(gameId: string): void {
  navigateTo(`/games/${gameId}/analysis`)
}
</script>
