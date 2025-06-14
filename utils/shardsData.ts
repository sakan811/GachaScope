export interface ShardsPrice {
  baseShards: number;
  price: number;
  extraShards: number;
  purchaseType: 'normal' | 'first_time_bonus';
}

export interface ShardsPackage extends ShardsPrice {
  totalShards: number;
  shardsPerDollar: number;
  pullsFromPackage: number;
  costPerPull: number;
  leftoverShards: number;
}

export interface PurchaseScenario {
  packages: Array<{ package: ShardsPackage; count: number }>;
  totalCost: number;
  totalShards: number;
  totalPulls: number;
  leftoverShards: number;
  efficiency: number; // shards per dollar
  costPerPull: number;
  scenario: string;
}

// Constants
export const SHARDS_PER_PULL = 160;

// Raw data - same as before
export const normalPurchases: ShardsPrice[] = [
  { baseShards: 60, price: 0.99, extraShards: 0, purchaseType: 'normal' },
  { baseShards: 300, price: 4.99, extraShards: 30, purchaseType: 'normal' },
  { baseShards: 980, price: 14.99, extraShards: 110, purchaseType: 'normal' },
  { baseShards: 1980, price: 29.99, extraShards: 260, purchaseType: 'normal' },
  { baseShards: 3280, price: 49.99, extraShards: 600, purchaseType: 'normal' },
  { baseShards: 6480, price: 99.99, extraShards: 1600, purchaseType: 'normal' },
];

export const firstTimeBonus: ShardsPrice[] = [
  { baseShards: 60, price: 0.99, extraShards: 60, purchaseType: 'first_time_bonus' },
  { baseShards: 300, price: 4.99, extraShards: 300, purchaseType: 'first_time_bonus' },
  { baseShards: 980, price: 14.99, extraShards: 980, purchaseType: 'first_time_bonus' },
  { baseShards: 1980, price: 29.99, extraShards: 1980, purchaseType: 'first_time_bonus' },
  { baseShards: 3280, price: 49.99, extraShards: 3280, purchaseType: 'first_time_bonus' },
  { baseShards: 6480, price: 99.99, extraShards: 6480, purchaseType: 'first_time_bonus' },
];

// Helper functions
export function createPackage(shardsPrice: ShardsPrice): ShardsPackage {
  const totalShards = shardsPrice.baseShards + shardsPrice.extraShards;
  const shardsPerDollar = totalShards / shardsPrice.price;
  const pullsFromPackage = Math.floor(totalShards / SHARDS_PER_PULL);
  const leftoverShards = totalShards % SHARDS_PER_PULL;
  const costPerPull = pullsFromPackage > 0 ? shardsPrice.price / pullsFromPackage : shardsPrice.price;
  
  return {
    ...shardsPrice,
    totalShards,
    shardsPerDollar,
    pullsFromPackage,
    costPerPull,
    leftoverShards,
  };
}

// Generate realistic purchase scenarios
export function generatePurchaseScenarios(): { 
  normalScenarios: PurchaseScenario[]; 
  firstTimeScenarios: PurchaseScenario[] 
} {
  const normalPackages = normalPurchases.map(createPackage);
  const firstTimeBonusPackages = firstTimeBonus.map(createPackage);
  
  const normalScenarios: PurchaseScenario[] = [];
  const firstTimeScenarios: PurchaseScenario[] = [];
  
  // Generate scenarios for both types
  [
    { packages: normalPackages, scenarios: normalScenarios, type: 'normal' },
    { packages: firstTimeBonusPackages, scenarios: firstTimeScenarios, type: 'first_time' }
  ].forEach(({ packages, scenarios, type }) => {
    
    // Single package purchases
    packages.forEach((pkg, index) => {
      const scenario = createScenario([{ package: pkg, count: 1 }], `Single ${type} package ${index + 1}`);
      scenarios.push(scenario);
    });
    
    // Multiple of same package (2x, 3x for smaller packages)
    packages.slice(0, 4).forEach((pkg, index) => {
      for (let count = 2; count <= 3; count++) {
        const scenario = createScenario([{ package: pkg, count }], `${count}x ${type} package ${index + 1}`);
        scenarios.push(scenario);
      }
    });
    
    // Common combination scenarios
    if (packages.length >= 3) {
      // Small + Medium combo
      const combo1 = createScenario(
        [{ package: packages[1], count: 1 }, { package: packages[2], count: 1 }],
        `${type} combo: small + medium`
      );
      scenarios.push(combo1);
      
      // Medium + Large combo
      const combo2 = createScenario(
        [{ package: packages[2], count: 1 }, { package: packages[4], count: 1 }],
        `${type} combo: medium + large`
      );
      scenarios.push(combo2);
    }
    
    // High spender scenarios (for packages that give many pulls)
    const highValuePackages = packages.filter(pkg => pkg.pullsFromPackage >= 10);
    if (highValuePackages.length > 0) {
      const largestPackage = highValuePackages[highValuePackages.length - 1];
      const whaleScenario = createScenario([{ package: largestPackage, count: 2 }], `${type} whale scenario`);
      scenarios.push(whaleScenario);
    }
  });
  
  // Sort by total cost
  normalScenarios.sort((a, b) => a.totalCost - b.totalCost);
  firstTimeScenarios.sort((a, b) => a.totalCost - b.totalCost);
  
  return { normalScenarios, firstTimeScenarios };
}

function createScenario(purchases: Array<{ package: ShardsPackage; count: number }>, scenario: string): PurchaseScenario {
  const totalCost = purchases.reduce((sum, { package: pkg, count }) => sum + (pkg.price * count), 0);
  const totalShards = purchases.reduce((sum, { package: pkg, count }) => sum + (pkg.totalShards * count), 0);
  const totalPulls = Math.floor(totalShards / SHARDS_PER_PULL);
  const leftoverShards = totalShards % SHARDS_PER_PULL;
  const efficiency = totalShards / totalCost;
  const costPerPull = totalPulls > 0 ? totalCost / totalPulls : Infinity;
  
  return {
    packages: purchases,
    totalCost,
    totalShards,
    totalPulls,
    leftoverShards,
    efficiency,
    costPerPull,
    scenario,
  };
}

// Generate chart data based on realistic scenarios
export function generateChartData(): {
  normalData: Array<{ pulls: number; cost: number; scenario: string }>;
  firstTimeData: Array<{ pulls: number; cost: number; scenario: string }>;
  savingsData: Array<{ pulls: number; savings: number; scenario: string }>;
} {
  const { normalScenarios, firstTimeScenarios } = generatePurchaseScenarios();
  
  const normalData = normalScenarios.map(scenario => ({
    pulls: scenario.totalPulls,
    cost: scenario.totalCost,
    scenario: scenario.scenario
  }));
  
  const firstTimeData = firstTimeScenarios.map(scenario => ({
    pulls: scenario.totalPulls,
    cost: scenario.totalCost,
    scenario: scenario.scenario
  }));
  
  // Calculate savings by matching scenarios with similar pull counts
  const savingsData: Array<{ pulls: number; savings: number; scenario: string }> = [];
  
  firstTimeScenarios.forEach(firstTimeScenario => {
    // Find normal scenario with similar or same number of pulls
    const matchingNormal = normalScenarios.find(normal => 
      Math.abs(normal.totalPulls - firstTimeScenario.totalPulls) <= 2
    );
    
    if (matchingNormal) {
      const savings = matchingNormal.totalCost - firstTimeScenario.totalCost;
      if (savings > 0) {
        savingsData.push({
          pulls: firstTimeScenario.totalPulls,
          savings,
          scenario: firstTimeScenario.scenario
        });
      }
    }
  });
  
  return { normalData, firstTimeData, savingsData };
}

// Create processed packages for display
export const normalPackages = normalPurchases.map(createPackage);
export const firstTimeBonusPackages = firstTimeBonus.map(createPackage);

// Generate pre-calculated scenarios
export const { normalScenarios, firstTimeScenarios } = generatePurchaseScenarios();
export const chartData = generateChartData();