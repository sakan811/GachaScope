import type { 
  PurchasePackage, 
  ProcessedPackage, 
  PurchaseScenario, 
  GameData, 
  GameAnalysisResult, 
  PurchaseType, 
  ChartKey
} from '~/types/games'
import { getGameById } from '~/utils/gameRegistry'

export const useGameAnalysis = () => {

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

  function generateScenarios(gameData: GameData): Partial<Record<PurchaseType, PurchaseScenario[]>> {
    const pullCost = gameData.metadata.pull.cost
    const config = gameData.metadata.analysisConfig

    const scenarioGroups: Partial<Record<PurchaseType, PurchaseScenario[]>> = {}

    for (const [groupKey, rawPackages] of Object.entries(gameData.packages)) {
      if (!rawPackages) continue

      const processedPackages = rawPackages.map(pkg => processPackage(pkg, pullCost))
      const scenarios: PurchaseScenario[] = []

      processedPackages.forEach((pkg, index) => {
        scenarios.push(createScenario([{ package: pkg, count: 1 }], `${groupKey} package ${index + 1}`, pullCost))

        if (config.includeMultiPackage) {
          for (let count = 2; count <= config.maxPackageMultiplier; count++) {
            scenarios.push(createScenario([{ package: pkg, count }], `${count}x ${groupKey} package ${index + 1}`, pullCost))
          }
        }
      })

      if (config.includeMultiPackage && processedPackages.length >= 3) {
        scenarios.push(createScenario(
          [
            { package: processedPackages[1], count: 1 },
            { package: processedPackages[2], count: 1 }
          ],
          `${groupKey} combo 2+3`,
          pullCost
        ))
      }

      scenarios.sort((a, b) => a.totalCost - b.totalCost)

      if (['normal', 'first_time_bonus', 'limited_time', 'subscription'].includes(groupKey)) {
        scenarioGroups[groupKey as PurchaseType] = scenarios.slice(0, config.maxScenarios)
      }
    }

    return scenarioGroups
  }


  function generateChartData(
    scenariosByType: Partial<Record<ChartKey, PurchaseScenario[]>>
  ): {
    costVsPulls: Array<{ pulls: number; cost: number; scenario: string; type: ChartKey }>;
    efficiency: Array<{ package: string; costPerPull: number; type: ChartKey }>;
    savings: Array<{ package: string; savings: number; pulls: number }>;
  } {
    const costVsPulls: Array<{ pulls: number; cost: number; scenario: string; type: ChartKey }> = []
    const efficiency: Array<{ package: string; costPerPull: number; type: ChartKey }> = []

    for (const [type, scenarios] of Object.entries(scenariosByType) as [ChartKey, PurchaseScenario[]][]) {
      scenarios.forEach((s, i) => {
        costVsPulls.push({ pulls: s.totalPulls, cost: s.totalCost, scenario: s.name, type })
        if (s.costPerPull !== Infinity) {
          efficiency.push({ package: `${type} ${i + 1}`, costPerPull: s.costPerPull, type })
        }
      })
    }

    const savings: Array<{ package: string; savings: number; pulls: number }> = []
    const normal = scenariosByType['normal'] || []
    const bonus = scenariosByType['first_time_bonus'] || []

    for (let i = 0; i < Math.min(normal.length, bonus.length); i++) {
      const pullDiff = bonus[i].totalPulls - normal[i].totalPulls
      const savingsAmount = Math.max(0, pullDiff * normal[i].costPerPull)
      if (savingsAmount > 0) {
        savings.push({
          package: `Package ${i + 1}`,
          savings: savingsAmount,
          pulls: bonus[i].totalPulls
        })
      }
    }

    return { costVsPulls, efficiency, savings }
  }


  function generateInsights(
    scenarios: Partial<Record<PurchaseType, PurchaseScenario[]>>,
    chartData: ReturnType<typeof generateChartData>
  ) {
    const normalScenarios = scenarios.normal ?? []
    const bonusScenarios = scenarios.first_time_bonus ?? []

    const allBonusScenarios = bonusScenarios.filter(s => s.totalPulls > 0)

    const maxSavings = chartData.savings.length > 0
      ? Math.max(...chartData.savings.map(s => s.savings))
      : 0

    const bestScenario = allBonusScenarios.length > 0
      ? allBonusScenarios.reduce((best, s) => s.costPerPull < best.costPerPull ? s : best)
      : bonusScenarios[0] || normalScenarios[0]

    const bestPackage = bestScenario?.packages?.[0]?.package

    const avgSavings = chartData.savings.length > 0
      ? chartData.savings.reduce((sum, s) => sum + s.savings, 0) / chartData.savings.length
      : 0

    return {
      maxSavings,
      bestPackage,
      avgSavings
    }
  }
  
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

  function getProcessedPackages(gameId: string): Record<string, ProcessedPackage[]> | null {
    const gameData = getGameById(gameId)
    if (!gameData) return null

    const pullCost = gameData.metadata.pull.cost
    const result: Record<string, ProcessedPackage[]> = {}

    for (const [type, packages] of Object.entries(gameData.packages)) {
      result[type] = packages.map(pkg => processPackage(pkg, pullCost))
    }

    return result
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
