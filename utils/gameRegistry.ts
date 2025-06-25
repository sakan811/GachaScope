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

// Register games
gameRegistry.set('hsr', hsrGameData)

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

// Export HSR data for easier imports
export { hsrGameData }
