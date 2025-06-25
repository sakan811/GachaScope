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
