export type PurchaseType = 'normal' | 'first_time_bonus' | 'limited_time' | 'subscription';

export interface GameCurrency {
  name: string;
  shortName: string;
}

export interface GamePull {
  name: string;
  cost: number; // in primary currency units
}

export interface PurchasePackage {
  id: string;
  name: string;
  baseAmount: number;
  price: number;
  extraAmount: number;
  purchaseType: PurchaseType;
  currency: string;
  description?: string;
  icon?: string;
  tags?: string[];
}

export interface ProcessedPackage extends PurchasePackage {
  totalAmount: number;
  amountPerDollar: number;
  pullsFromPackage: number;
  costPerPull: number;
  leftoverAmount: number;
  efficiency: number;
}

export interface PurchaseScenario {
  id: string;
  name: string;
  description: string;
  packages: Array<{ package: ProcessedPackage; count: number }>;
  totalCost: number;
  totalAmount: number;
  totalPulls: number;
  leftoverAmount: number;
  efficiency: number;
  costPerPull: number;
}

export interface GameMetadata {
  id: string;
  name: string;
  shortName: string;
    
  // Game mechanics
  currency: GameCurrency;
  pull: GamePull;
  
  // Analysis configuration
  analysisConfig: {
    maxScenarios: number;
    includeMultiPackage: boolean;
    maxPackageMultiplier: number;
  };
}

export interface GameData {
  metadata: GameMetadata;
  packages: Partial<Record<PurchaseType, PurchasePackage[]>>;
}

export type ChartKey = PurchaseType | 'combined'

export interface GameAnalysisResult {
  gameId: string;
  scenarios: Partial<Record<ChartKey, PurchaseScenario[]>>;
  chartData: {
    costVsPulls: Array<{ pulls: number; cost: number; scenario: string; type: ChartKey }>;
    efficiency: Array<{ package: string; costPerPull: number; type: PurchaseType | 'combined' }>;
    savings: Array<{ package: string; savings: number; pulls: number }>;
  };
  insights: {
    maxSavings: number;
    bestPackage: ProcessedPackage | null;
    bestScenario: PurchaseScenario | null;
    avgSavings: number;
    bestPackageName: string;
  };
}