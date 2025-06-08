export interface ShardsPrice {
  baseShards: number;
  price: number;
  extraShards: number;
  purchaseType: 'normal' | 'first_time_bonus';
}

export interface ShardsPackage extends ShardsPrice {
  totalShards: number;
  shardsPerDollar: number;
  costPerPull: number;
}

// Constants
export const SHARDS_PER_PULL = 160;

// Raw data
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
  const costPerPull = shardsPrice.price / (totalShards / SHARDS_PER_PULL);
  
  return {
    ...shardsPrice,
    totalShards,
    shardsPerDollar,
    costPerPull,
  };
}

export function calculateOptimalCost(targetPulls: number, packages: ShardsPrice[]): { cost: number; purchases: Array<{ package: ShardsPackage; count: number }> } {
  const targetShards = targetPulls * SHARDS_PER_PULL;
  
  // Sort packages by efficiency (shards per dollar, descending)
  const sortedPackages = packages
    .map(createPackage)
    .sort((a, b) => b.shardsPerDollar - a.shardsPerDollar);
  
  // Greedy approach: use most efficient packages first
  let remainingShards = targetShards;
  let totalCost = 0;
  const purchases: Array<{ package: ShardsPackage; count: number }> = [];
  
  for (const pkg of sortedPackages) {
    if (remainingShards <= 0) break;
    
    // Calculate how many of this package we need
    const count = Math.floor(remainingShards / pkg.totalShards);
    if (count > 0) {
      purchases.push({ package: pkg, count });
      totalCost += pkg.price * count;
      remainingShards -= pkg.totalShards * count;
    }
  }
  
  // Handle remaining shards with the smallest package
  if (remainingShards > 0) {
    const smallestPackage = sortedPackages.reduce((min, pkg) => 
      pkg.totalShards < min.totalShards ? pkg : min
    );
    purchases.push({ package: smallestPackage, count: 1 });
    totalCost += smallestPackage.price;
  }
  
  return { cost: totalCost, purchases };
}

export function generatePullCosts(maxPulls: number = 180): { normalCosts: number[]; firstTimeCosts: number[] } {
  const normalCosts: number[] = [];
  const firstTimeCosts: number[] = [];
  
  for (let pulls = 1; pulls <= maxPulls; pulls++) {
    const normalResult = calculateOptimalCost(pulls, normalPurchases);
    const firstTimeResult = calculateOptimalCost(pulls, firstTimeBonus);
    
    normalCosts.push(normalResult.cost);
    firstTimeCosts.push(firstTimeResult.cost);
  }
  
  return { normalCosts, firstTimeCosts };
}

// Pre-calculate costs for pulls 1-180
export const { normalCosts: NORMAL_COSTS, firstTimeCosts: FIRST_TIME_COSTS } = generatePullCosts(180);

// Create processed packages for display
export const normalPackages = normalPurchases.map(createPackage);
export const firstTimeBonusPackages = firstTimeBonus.map(createPackage);