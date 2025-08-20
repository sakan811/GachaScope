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

// Zenless Zone Zero Configuration
const zzzGameData: GameData = {
  metadata: {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    shortName: 'ZZZ',

    currency: {
      name: 'Monochrome',
      shortName: 'Monochrome',
    },

    pull: {
      name: 'Signal Search',
      cost: 160, // 160 Polychrome per pull (converted from Monochrome)
    },

    analysisConfig: {
      maxScenarios: 50,
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
    },
  },

  packages: {
    normal: [
      { id: 'zzz_n1', name: 'Monochrome ×60', baseAmount: 60, price: 0.99, extraAmount: 0, purchaseType: 'normal', currency: 'monochrome' },
      { id: 'zzz_n2', name: 'Monochrome ×300', baseAmount: 300, price: 4.99, extraAmount: 30, purchaseType: 'normal', currency: 'monochrome' },
      { id: 'zzz_n3', name: 'Monochrome ×980', baseAmount: 980, price: 14.99, extraAmount: 110, purchaseType: 'normal', currency: 'monochrome' },
      { id: 'zzz_n4', name: 'Monochrome ×1980', baseAmount: 1980, price: 29.99, extraAmount: 260, purchaseType: 'normal', currency: 'monochrome' },
      { id: 'zzz_n5', name: 'Monochrome ×3280', baseAmount: 3280, price: 49.99, extraAmount: 600, purchaseType: 'normal', currency: 'monochrome' },
      { id: 'zzz_n6', name: 'Monochrome ×6480', baseAmount: 6480, price: 99.99, extraAmount: 1600, purchaseType: 'normal', currency: 'monochrome' },
    ],

    first_time_bonus: [
      { id: 'zzz_b1', name: 'Monochrome ×60 (First Purchase)', baseAmount: 60, price: 0.99, extraAmount: 60, purchaseType: 'first_time_bonus', currency: 'monochrome' },
      { id: 'zzz_b2', name: 'Monochrome ×300 (First Purchase)', baseAmount: 300, price: 4.99, extraAmount: 300, purchaseType: 'first_time_bonus', currency: 'monochrome' },
      { id: 'zzz_b3', name: 'Monochrome ×980 (First Purchase)', baseAmount: 980, price: 14.99, extraAmount: 980, purchaseType: 'first_time_bonus', currency: 'monochrome' },
      { id: 'zzz_b4', name: 'Monochrome ×1980 (First Purchase)', baseAmount: 1980, price: 29.99, extraAmount: 1980, purchaseType: 'first_time_bonus', currency: 'monochrome' },
      { id: 'zzz_b5', name: 'Monochrome ×3280 (First Purchase)', baseAmount: 3280, price: 49.99, extraAmount: 3280, purchaseType: 'first_time_bonus', currency: 'monochrome' },
      { id: 'zzz_b6', name: 'Monochrome ×6480 (First Purchase)', baseAmount: 6480, price: 99.99, extraAmount: 6480, purchaseType: 'first_time_bonus', currency: 'monochrome' },
    ],

    subscription: [
      { id: 'zzz_s1', name: 'Inter-Knot Membership', baseAmount: 300, price: 4.99, extraAmount: 2700, purchaseType: 'subscription', currency: 'monochrome', description: '300 Monochrome immediately + 90 Polychrome daily for 30 days' },
    ],

    battle_pass: [
      { id: 'zzz_bp1', name: 'New Eridu City Fund - Growth Plan', baseAmount: 780, price: 9.99, extraAmount: 640, purchaseType: 'battle_pass', currency: 'monochrome', description: '780 Polychrome plus 4 Encrypted Master Tape' },
      { id: 'zzz_bp2', name: 'New Eridu City Fund - Premium Plan', baseAmount: 980, price: 19.99, extraAmount: 640, purchaseType: 'battle_pass', currency: 'monochrome', description: '980 Polychrome plus 4 Encrypted Master Tape' },
    ],
  },
}

// Umamusume: Pretty Derby (Global) Configuration
const umaGameData: GameData = {
  metadata: {
    id: 'uma',
    name: 'Umamusume: Pretty Derby (Global)',
    shortName: 'Umamusume',

    currency: {
      name: 'Carats',
      shortName: 'Carats',
    },

    pull: {
      name: 'Make Debut Ticket',
      cost: 150, // 150 Carats per pull
    },

    analysisConfig: {
      maxScenarios: 50,
      includeMultiPackage: true,
      maxPackageMultiplier: 3,
    },
  },

  packages: {
    normal: [
      { id: 'uma_n1', name: 'Carats ×60', baseAmount: 60, price: 0.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n2', name: 'Carats ×210', baseAmount: 210, price: 2.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n3', name: 'Carats ×350', baseAmount: 350, price: 5.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n4', name: 'Carats ×700', baseAmount: 700, price: 9.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n5', name: 'Carats ×1500', baseAmount: 1500, price: 20.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n6', name: 'Carats ×2500', baseAmount: 2500, price: 33.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
      { id: 'uma_n7', name: 'Carats ×5000', baseAmount: 5000, price: 69.99, extraAmount: 0, purchaseType: 'normal', currency: 'carats' },
    ],

    first_time_bonus: [
      { id: 'uma_sp1', name: 'Rookie Starter Pack A', baseAmount: 600, price: 3.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'carats', description: '600 Carats + Monies + Support Points' },
      { id: 'uma_sp2', name: 'Rookie Starter Pack B', baseAmount: 1500, price: 20.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'carats', description: '1500 Carats + 3☆ Guaranteed Make Debut Ticket (Trainee)' },
      { id: 'uma_sp3', name: 'Rookie Starter Pack C', baseAmount: 1500, price: 20.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'carats', description: '1500 Carats + 3☆ Guaranteed Make Debut Ticket (Support Card)' },
      { id: 'uma_l1', name: 'Carats ×2500 (Limited, Max x2)', baseAmount: 2500, price: 13.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'carats', description: 'Limited Offer, Maximum 2 purchases' },
      { id: 'uma_l2', name: 'Carats ×7500 (Limited, Max x3)', baseAmount: 7500, price: 69.99, extraAmount: 0, purchaseType: 'first_time_bonus', currency: 'carats', description: 'Limited Offer, Maximum 3 purchases' },
    ],

    subscription: [
      { id: 'uma_s1', name: 'Daily Carat Pack', baseAmount: 500, price: 6.99, extraAmount: 1500, purchaseType: 'subscription', currency: 'carats', description: '500 Carats immediately + 50 Carats daily for 30 days' },
    ],
  },
}

// Register games
gameRegistry.set('hsr', hsrGameData)
gameRegistry.set('wuwa', wuwaGameData)
gameRegistry.set('zzz', zzzGameData)
gameRegistry.set('uma', umaGameData)

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
export { hsrGameData, wuwaGameData, zzzGameData, umaGameData }
