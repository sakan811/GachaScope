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

export type PurchaseType = 'normal' | 'first_time_bonus' | 'battle_pass' | 'subscription'

export interface GameCurrency {
  name: string
  shortName: string
}

export interface GamePull {
  name: string
  cost: number // in primary currency units
}

export interface PurchasePackage {
  id: string
  name: string
  baseAmount: number
  price: number
  extraAmount: number
  purchaseType: PurchaseType
  currency: string
  description?: string
  icon?: string
  tags?: string[]
}

export interface ProcessedPurchase extends PurchasePackage {
  totalAmount: number
  amountPerDollar: number
  pullsFromPurchase: number
  costPerPull: number
  leftoverAmount: number
  efficiency: number
}

export interface PurchaseScenario {
  id: string
  name: string
  description: string
  purchases: Array<{ purchase: ProcessedPurchase, count: number }>
  totalCost: number
  totalAmount: number
  totalPulls: number
  leftoverAmount: number
  efficiency: number
  costPerPull: number
}

export interface GameMetadata {
  id: string
  name: string
  shortName: string

  // Game mechanics
  currency: GameCurrency
  pull: GamePull

  // Analysis configuration
  analysisConfig: {
    maxScenarios: number
    includeMultiPackage: boolean
    maxPackageMultiplier: number
  }
}

export interface GameData {
  metadata: GameMetadata
  packages: Partial<Record<PurchaseType, PurchasePackage[]>>
}

export type ChartKey = PurchaseType | 'combined'

export interface GameAnalysisResult {
  gameId: string
  scenarios: Partial<Record<ChartKey, PurchaseScenario[]>>
  chartData: {
    costVsPulls: Array<{ pulls: number, cost: number, scenario: string, type: ChartKey }>
    efficiency: Array<{ purchase: string, costPerPull: number, type: PurchaseType | 'combined' }>
    savings: Array<{ purchase: string, savings: number, pulls: number }>
  }
  insights: {
    maxSavings: number
    bestPurchase: ProcessedPurchase | null
    bestScenario: PurchaseScenario | null
    avgSavings: number
    bestPurchaseName: string
  }
}
