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

import type { GameData, GameMetadata } from '~/types/games'

// Game registry - easily extensible for new games
const gameRegistry = new Map<string, GameData>()

// Honkai Star Rail Configuration
const hsrGameData: GameData = {
  metadata: {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    shortName: 'HSR',

    currency: {
      name: 'Oneiric Shards',
      shortName: 'Shards',
    },

    pull: {
      name: 'Warp',
      cost: 160, // 160 shards per pull
    },

    analysisConfig: {
      maxScenarios: 50,
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
    },
  },

  packages: {
    normal: [
      { id: 'hsr_n1', name: 'Oneiric Shard ×60', baseAmount: 60, price: 0.99, extraAmount: 0, purchaseType: 'normal', currency: 'shards' },
      { id: 'hsr_n2', name: 'Oneiric Shard ×300', baseAmount: 300, price: 4.99, extraAmount: 30, purchaseType: 'normal', currency: 'shards' },
      { id: 'hsr_n3', name: 'Oneiric Shard ×980', baseAmount: 980, price: 14.99, extraAmount: 110, purchaseType: 'normal', currency: 'shards' },
      { id: 'hsr_n4', name: 'Oneiric Shard ×1980', baseAmount: 1980, price: 29.99, extraAmount: 260, purchaseType: 'normal', currency: 'shards' },
      { id: 'hsr_n5', name: 'Oneiric Shard ×3280', baseAmount: 3280, price: 49.99, extraAmount: 600, purchaseType: 'normal', currency: 'shards' },
      { id: 'hsr_n6', name: 'Oneiric Shard ×6480', baseAmount: 6480, price: 99.99, extraAmount: 1600, purchaseType: 'normal', currency: 'shards' },
    ],

    first_time_bonus: [
      { id: 'hsr_b1', name: 'Oneiric Shard ×60 (First Purchase)', baseAmount: 60, price: 0.99, extraAmount: 60, purchaseType: 'first_time_bonus', currency: 'shards' },
      { id: 'hsr_b2', name: 'Oneiric Shard ×300 (First Purchase)', baseAmount: 300, price: 4.99, extraAmount: 300, purchaseType: 'first_time_bonus', currency: 'shards' },
      { id: 'hsr_b3', name: 'Oneiric Shard ×980 (First Purchase)', baseAmount: 980, price: 14.99, extraAmount: 980, purchaseType: 'first_time_bonus', currency: 'shards' },
      { id: 'hsr_b4', name: 'Oneiric Shard ×1980 (First Purchase)', baseAmount: 1980, price: 29.99, extraAmount: 1980, purchaseType: 'first_time_bonus', currency: 'shards' },
      { id: 'hsr_b5', name: 'Oneiric Shard ×3280 (First Purchase)', baseAmount: 3280, price: 49.99, extraAmount: 3280, purchaseType: 'first_time_bonus', currency: 'shards' },
      { id: 'hsr_b6', name: 'Oneiric Shard ×6480 (First Purchase)', baseAmount: 6480, price: 99.99, extraAmount: 6480, purchaseType: 'first_time_bonus', currency: 'shards' },
    ],

    subscription: [
      { id: 'hsr_s1', name: 'Express Supply Pass', baseAmount: 300, price: 4.99, extraAmount: 2700, purchaseType: 'subscription', currency: 'shards', description: '300 Oneiric Shards immediately + 90 Stellar Jade daily for 30 days' },
    ],

    battle_pass: [
      { id: 'hsr_bp1', name: 'Nameless Glory', baseAmount: 680, price: 9.99, extraAmount: 640, purchaseType: 'battle_pass', currency: 'shards', description: '680 Stellar Jade plus 4 Star Rail Special Pass' },
      { id: 'hsr_bp2', name: 'Nameless Medal', baseAmount: 880, price: 19.99, extraAmount: 640, purchaseType: 'battle_pass', currency: 'shards', description: '880 Stellar Jade plus 4 Star Rail Special Pass' },
    ],
  },
}

// Wuthering Waves Configuration
const wuwaGameData: GameData = {
  metadata: {
    id: 'wuwa',
    name: 'Wuthering Waves',
    shortName: 'WuWa',

    currency: {
      name: 'Lunite',
      shortName: 'Lunite',
    },

    pull: {
      name: 'Convene',
      cost: 160, // 160 Astrites per pull (converted from Lunite)
    },

    analysisConfig: {
      maxScenarios: 50,
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
    },
  },

  packages: {
    normal: [
      { id: 'wuwa_n1', name: 'Lunite ×60', baseAmount: 60, price: 0.99, extraAmount: 0, purchaseType: 'normal', currency: 'lunite' },
      { id: 'wuwa_n2', name: 'Lunite ×300', baseAmount: 300, price: 4.99, extraAmount: 30, purchaseType: 'normal', currency: 'lunite' },
      { id: 'wuwa_n3', name: 'Lunite ×980', baseAmount: 980, price: 14.99, extraAmount: 110, purchaseType: 'normal', currency: 'lunite' },
      { id: 'wuwa_n4', name: 'Lunite ×1980', baseAmount: 1980, price: 29.99, extraAmount: 260, purchaseType: 'normal', currency: 'lunite' },
      { id: 'wuwa_n5', name: 'Lunite ×3280', baseAmount: 3280, price: 49.99, extraAmount: 600, purchaseType: 'normal', currency: 'lunite' },
      { id: 'wuwa_n6', name: 'Lunite ×6480', baseAmount: 6480, price: 99.99, extraAmount: 1600, purchaseType: 'normal', currency: 'lunite' },
    ],

    first_time_bonus: [
      { id: 'wuwa_b1', name: 'Lunite ×60 (First Purchase)', baseAmount: 60, price: 0.99, extraAmount: 60, purchaseType: 'first_time_bonus', currency: 'lunite' },
      { id: 'wuwa_b2', name: 'Lunite ×300 (First Purchase)', baseAmount: 300, price: 4.99, extraAmount: 300, purchaseType: 'first_time_bonus', currency: 'lunite' },
      { id: 'wuwa_b3', name: 'Lunite ×980 (First Purchase)', baseAmount: 980, price: 14.99, extraAmount: 980, purchaseType: 'first_time_bonus', currency: 'lunite' },
      { id: 'wuwa_b4', name: 'Lunite ×1980 (First Purchase)', baseAmount: 1980, price: 29.99, extraAmount: 1980, purchaseType: 'first_time_bonus', currency: 'lunite' },
      { id: 'wuwa_b5', name: 'Lunite ×3280 (First Purchase)', baseAmount: 3280, price: 49.99, extraAmount: 3280, purchaseType: 'first_time_bonus', currency: 'lunite' },
      { id: 'wuwa_b6', name: 'Lunite ×6480 (First Purchase)', baseAmount: 6480, price: 99.99, extraAmount: 6480, purchaseType: 'first_time_bonus', currency: 'lunite' },
    ],

    subscription: [
      { id: 'wuwa_s1', name: 'Lunite Subscription', baseAmount: 300, price: 4.99, extraAmount: 2700, purchaseType: 'subscription', currency: 'lunite', description: '300 Lunites immediately + 90 Astrites daily for 30 days' },
    ],

    battle_pass: [
      { id: 'wuwa_bp1', name: 'Insider Channel', baseAmount: 680, price: 9.99, extraAmount: 800, purchaseType: 'battle_pass', currency: 'lunite', description: 'Includes Astrites, Radiant Tides, and various materials' },
      { id: 'wuwa_bp2', name: 'Connoisseur Channel', baseAmount: 680, price: 19.99, extraAmount: 800, purchaseType: 'battle_pass', currency: 'lunite', description: 'Premium version with additional rewards' },
    ],
  },
}

// Register games
gameRegistry.set('hsr', hsrGameData)
gameRegistry.set('wuwa', wuwaGameData)

// Game registry functions
export function getAllGames(): GameData[] {
  return Array.from(gameRegistry.values())
}

export function getActiveGames(): GameData[] {
  return getAllGames()
}

export function getGameById(gameId: string): GameData | undefined {
  return gameRegistry.get(gameId)
}

export function getGameMetadata(gameId: string): GameMetadata | undefined {
  return gameRegistry.get(gameId)?.metadata
}

export function registerGame(gameData: GameData): void {
  gameRegistry.set(gameData.metadata.id, gameData)
}

export function isValidGameId(gameId: string): boolean {
  return gameRegistry.has(gameId)
}

export function getGameNames(): Array<{ id: string, name: string, shortName: string }> {
  return Array.from(gameRegistry.values()).map(game => ({
    id: game.metadata.id,
    name: game.metadata.name,
    shortName: game.metadata.shortName,
  }))
}

// Export game data for easier imports
export { hsrGameData, wuwaGameData }
