import type { 
  PurchasePackage, 
  ProcessedPackage, 
  PurchaseScenario, 
  GameData,
  GameAnalysisResult 
} from '~/types/games'
import { getGameById } from '~/utils/gameRegistry'

export const useGameAnalysis = () => {
  
  /**
   * Process a raw package into analyzed data
   */
  function processPackage(rawPackage: PurchasePackage, pullCost: number): ProcessedPackage {
    const totalAmount = rawPackage.baseAmount + rawPackage.extraAmount
    const amountPerDollar = totalAmount / rawPackage.price
    const pullsFromPackage = Math.floor(totalAmount / pullCost)
    const leftoverAmount = totalAmount % pullCost
    const costPerPull = pullsFromPackage > 0 ? rawPackage.price / pullsFromPackage : Infinity
    const efficiency = amountPerDollar
    
    return {
      ...rawPackage,
      totalAmount,
      amountPerDollar,
      pullsFromPackage,
      costPerPull,
      leftoverAmount,
      efficiency
    }
  }
  
  /**
   * Create a purchase scenario from package combinations
   */
  function createScenario(
    purchases: Array<{ package: ProcessedPackage; count: number }>, 
    scenarioName: string,
    pullCost: number
  ): PurchaseScenario {
    const totalCost = purchases.reduce((sum, { package: pkg, count }) => sum + (pkg.price * count), 0)
    const totalAmount = purchases.reduce((sum, { package: pkg, count }) => sum + (pkg.totalAmount * count), 0)
    const totalPulls = Math.floor(totalAmount / pullCost)
    const leftoverAmount = totalAmount % pullCost
    const efficiency = totalAmount / totalCost
    const costPerPull = totalPulls > 0 ? totalCost / totalPulls : Infinity
    
    return {
      id: `scenario_${scenarioName.toLowerCase().replace(/\s+/g, '_')}`,
      name: scenarioName,
      description: `Purchasing ${purchases.map(p => `${p.count}x ${p.package.name}`).join(', ')}`,
      packages: purchases,
      totalCost,
      totalAmount,
      totalPulls,
      leftoverAmount,
      efficiency,
      costPerPull
    }
  }
  
  /**
   * Generate all possible scenarios for a game
   */
  function generateScenarios(gameData: GameData): { normal: PurchaseScenario[]; firstTimeBonus: PurchaseScenario[] } {
    const pullCost = gameData.metadata.pull.cost
    const config = gameData.metadata.analysisConfig
    
    const normalPackages = gameData.packages.normal.map(pkg => processPackage(pkg, pullCost))
    const bonusPackages = gameData.packages.firstTimeBonus.map(pkg => processPackage(pkg, pullCost))
    
    const normalScenarios: PurchaseScenario[] = []
    const firstTimeScenarios: PurchaseScenario[] = []
    
    // Generate scenarios for both types
    [
      { packages: normalPackages, scenarios: normalScenarios, type: 'normal' },
      { packages: bonusPackages, scenarios: firstTimeScenarios, type: 'first_time' }
    ].forEach(({ packages, scenarios, type }) => {
      
      // Single package purchases
      packages.forEach((pkg, index) => {
        const scenario = createScenario([{ package: pkg, count: 1 }], `${type} package ${index + 1}`, pullCost)
        scenarios.push(scenario)
      })
      
      if (config.includeMultiPackage) {
        // Multiple of same package
        packages.slice(0, Math.min(4, packages.length)).forEach((pkg, index) => {
          for (let count = 2; count <= config.maxPackageMultiplier; count++) {
            const scenario = createScenario([{ package: pkg, count }], `${count}x ${type} package ${index + 1}`, pullCost)
            scenarios.push(scenario)
          }
        })
        
        // Package combinations
        if (packages.length >= 3) {
          const combo1 = createScenario(
            [{ package: packages[1], count: 1 }, { package: packages[2], count: 1 }],
            `${type} combo: packages 2+3`,
            pullCost
          )
          scenarios.push(combo1)
          
          if (packages.length >= 5) {
            const combo2 = createScenario(
              [{ package: packages[2], count: 1 }, { package: packages[4], count: 1 }],
              `${type} combo: packages 3+5`,
              pullCost
            )
            scenarios.push(combo2)
          }
        }
      }
    })
    
    // Sort by cost and limit scenarios
    normalScenarios.sort((a, b) => a.totalCost - b.totalCost)
    firstTimeScenarios.sort((a, b) => a.totalCost - b.totalCost)
    
    return {
      normal: normalScenarios.slice(0, config.maxScenarios),
      firstTimeBonus: firstTimeScenarios.slice(0, config.maxScenarios)
    }
  }
  
  /**
   * Generate chart data for visualization
   */
  function generateChartData(scenarios: { normal: PurchaseScenario[]; firstTimeBonus: PurchaseScenario[] }) {
    const costVsPulls = [
      ...scenarios.normal.map(s => ({ pulls: s.totalPulls, cost: s.totalCost, scenario: s.name, type: 'normal' })),
      ...scenarios.firstTimeBonus.map(s => ({ pulls: s.totalPulls, cost: s.totalCost, scenario: s.name, type: 'bonus' }))
    ]
    
    const efficiency = [
      ...scenarios.normal.map((s, i) => ({ package: `Normal ${i + 1}`, costPerPull: s.costPerPull, type: 'normal' })),
      ...scenarios.firstTimeBonus.map((s, i) => ({ package: `Bonus ${i + 1}`, costPerPull: s.costPerPull, type: 'bonus' }))
    ].filter(item => item.costPerPull !== Infinity)
    
    // Calculate savings
    const savings: Array<{ package: string; savings: number; pulls: number }> = []
    scenarios.firstTimeBonus.forEach((bonusScenario, index) => {
      const normalScenario = scenarios.normal[index]
      if (normalScenario && normalScenario.totalPulls > 0 && bonusScenario.totalPulls > 0) {
        const pullDiff = bonusScenario.totalPulls - normalScenario.totalPulls
        const savings_amount = Math.max(0, (pullDiff * normalScenario.costPerPull))
        
        if (savings_amount > 0) {
          savings.push({
            package: `Package ${index + 1}`,
            savings: savings_amount,
            pulls: bonusScenario.totalPulls
          })
        }
      }
    })
    
    return { costVsPulls, efficiency, savings }
  }
  
  /**
   * Generate insights and recommendations
   */
  function generateInsights(
    scenarios: { normal: PurchaseScenario[]; firstTimeBonus: PurchaseScenario[] },
    chartData: ReturnType<typeof generateChartData>
  ) {
    const allBonusScenarios = scenarios.firstTimeBonus.filter(s => s.totalPulls > 0)
    const maxSavings = Math.max(...chartData.savings.map(s => s.savings), 0)
    const bestPackage = allBonusScenarios.reduce((best, scenario) => 
      scenario.costPerPull < best.costPerPull ? scenario.packages[0].package : best.packages[0].package
    )
    const avgSavings = chartData.savings.length > 0 
      ? chartData.savings.reduce((sum, s) => sum + s.savings, 0) / chartData.savings.length 
      : 0
    
    const recommendedStrategy = [
      'Purchase first-time bonus packages first for maximum value',
      'Larger packages generally offer better cost per pull',
      'Consider your budget and spending goals before purchasing',
      'First-time bonuses can only be purchased once per package'
    ]
    
    return {
      maxSavings,
      bestPackage,
      avgSavings,
      recommendedStrategy
    }
  }
  
  /**
   * Complete analysis for a specific game
   */
  function analyzeGame(gameId: string): GameAnalysisResult | null {
    const gameData = getGameById(gameId)
    if (!gameData) {
      console.error(`Game with ID '${gameId}' not found`)
      return null
    }
    
    try {
      const scenarios = generateScenarios(gameData)
      const chartData = generateChartData(scenarios)
      const insights = generateInsights(scenarios, chartData)
      
      return {
        gameId,
        scenarios,
        chartData,
        insights
      }
    } catch (error) {
      console.error(`Error analyzing game '${gameId}':`, error)
      return null
    }
  }
  
  /**
   * Get processed packages for a game
   */
  function getProcessedPackages(gameId: string) {
    const gameData = getGameById(gameId)
    if (!gameData) return null
    
    const pullCost = gameData.metadata.pull.cost
    
    return {
      normal: gameData.packages.normal.map(pkg => processPackage(pkg, pullCost)),
      firstTimeBonus: gameData.packages.firstTimeBonus.map(pkg => processPackage(pkg, pullCost))
    }
  }
  
  return {
    processPackage,
    createScenario,
    generateScenarios,
    generateChartData,
    generateInsights,
    analyzeGame,
    getProcessedPackages
  }
}