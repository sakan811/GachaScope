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

import type {
  PurchasePackage,
  ProcessedPurchase,
  PurchaseScenario,
  GameData,
  GameAnalysisResult,
  PurchaseType,
  ChartKey,
} from '~/types/games'
import { getGameById } from '~/utils/gameRegistry'

export const useGameAnalysis = () => {
  function processPurchase(rawPurchase: PurchasePackage, pullCost: number): ProcessedPurchase {
    const totalAmount = rawPurchase.baseAmount + rawPurchase.extraAmount
    const amountPerDollar = totalAmount / rawPurchase.price
    const pullsFromPurchase = Math.floor(totalAmount / pullCost)
    const leftoverAmount = totalAmount % pullCost
    const costPerPull = pullsFromPurchase > 0 ? rawPurchase.price / pullsFromPurchase : Infinity
    const efficiency = amountPerDollar

    return {
      ...rawPurchase,
      totalAmount,
      amountPerDollar,
      pullsFromPurchase,
      costPerPull,
      leftoverAmount,
      efficiency,
    }
  }

  function createScenario(
    purchases: Array<{ purchase: ProcessedPurchase, count: number }>,
    scenarioName: string,
    pullCost: number,
  ): PurchaseScenario {
    const totalCost = purchases.reduce((sum, { purchase: pkg, count }) => sum + (pkg.price * count), 0)
    const totalAmount = purchases.reduce((sum, { purchase: pkg, count }) => sum + (pkg.totalAmount * count), 0)
    const totalPulls = Math.floor(totalAmount / pullCost)
    const leftoverAmount = totalAmount % pullCost
    const efficiency = totalAmount / totalCost
    const costPerPull = totalPulls > 0 ? totalCost / totalPulls : Infinity

    return {
      id: `scenario_${scenarioName.toLowerCase().replace(/\s+/g, '_')}`,
      name: scenarioName,
      description: `Purchasing ${purchases.map(p => `${p.count}x ${p.purchase.name}`).join(', ')}`,
      purchases,
      totalCost,
      totalAmount,
      totalPulls,
      leftoverAmount,
      efficiency,
      costPerPull,
    }
  }

  function generateScenarios(gameData: GameData): Partial<Record<PurchaseType, PurchaseScenario[]>> {
    const pullCost = gameData.metadata.pull.cost
    const config = gameData.metadata.analysisConfig

    const scenarioGroups: Partial<Record<PurchaseType, PurchaseScenario[]>> = {}

    for (const [groupKey, rawPurchases] of Object.entries(gameData.packages)) {
      if (!rawPurchases) continue

      const processedPurchases = rawPurchases.map(pkg => processPurchase(pkg, pullCost))
      const scenarios: PurchaseScenario[] = []

      processedPurchases.forEach((pkg, index) => {
        scenarios.push(createScenario([{ purchase: pkg, count: 1 }], `${groupKey} purchase ${index + 1}`, pullCost))

        if (config.includeMultiPackage) {
          for (let count = 2; count <= config.maxPackageMultiplier; count++) {
            scenarios.push(createScenario([{ purchase: pkg, count }], `${count}x ${groupKey} purchase ${index + 1}`, pullCost))
          }
        }
      })

      if (config.includeMultiPackage && processedPurchases.length >= 3) {
        scenarios.push(createScenario(
          [
            { purchase: processedPurchases[1], count: 1 },
            { purchase: processedPurchases[2], count: 1 },
          ],
          `${groupKey} combo 2+3`,
          pullCost,
        ))
      }

      scenarios.sort((a, b) => a.totalCost - b.totalCost)

      if (['normal', 'first_time_bonus', 'limited_time', 'subscription', 'battle_pass'].includes(groupKey)) {
        scenarioGroups[groupKey as PurchaseType] = scenarios.slice(0, config.maxScenarios)
      }
    }

    return scenarioGroups
  }

  function generateChartData(
    scenariosByType: Partial<Record<ChartKey, PurchaseScenario[]>>,
  ): {
      costVsPulls: Array<{ pulls: number, cost: number, scenario: string, type: ChartKey }>
      efficiency: Array<{ purchase: string, costPerPull: number, type: ChartKey }>
      savings: Array<{ purchase: string, savings: number, pulls: number }>
    } {
    const costVsPulls: Array<{ pulls: number, cost: number, scenario: string, type: ChartKey }> = []
    const efficiency: Array<{ purchase: string, costPerPull: number, type: ChartKey }> = []

    for (const [type, scenarios] of Object.entries(scenariosByType) as [ChartKey, PurchaseScenario[]][]) {
      scenarios.forEach((s, i) => {
        costVsPulls.push({ pulls: s.totalPulls, cost: s.totalCost, scenario: s.name, type })
        if (s.costPerPull !== Infinity) {
          efficiency.push({ purchase: `${type} ${i + 1}`, costPerPull: s.costPerPull, type })
        }
      })
    }

    const savings: Array<{ purchase: string, savings: number, pulls: number }> = []
    const normal = scenariosByType['normal'] || []
    const bonus = scenariosByType['first_time_bonus'] || []

    for (let i = 0; i < Math.min(normal.length, bonus.length); i++) {
      const normalScenario = normal[i]
      const bonusScenario = bonus[i]

      if (!normalScenario || !bonusScenario
        || normalScenario.costPerPull === Infinity
        || bonusScenario.totalPulls === undefined
        || normalScenario.totalPulls === undefined) {
        continue
      }

      const pullDiff = bonusScenario.totalPulls - normalScenario.totalPulls
      const savingsAmount = Math.max(0, pullDiff * normalScenario.costPerPull)
      if (savingsAmount > 0) {
        savings.push({
          purchase: `Purchase ${i + 1}`,
          savings: savingsAmount,
          pulls: bonusScenario.totalPulls,
        })
      }
    }

    return { costVsPulls, efficiency, savings }
  }

  function generateInsights(
    scenarios: Partial<Record<PurchaseType, PurchaseScenario[]>>,
    _chartData: ReturnType<typeof generateChartData>,
  ) {
    const normalScenarios = scenarios.normal ?? []
    const bonusScenarios = scenarios.first_time_bonus ?? []

    // Find all valid purchases from scenarios
    const allPurchases = [...normalScenarios, ...bonusScenarios]
      .flatMap(scenario => scenario.purchases.map(({ purchase: pkg }) => pkg))
      .filter(pkg => pkg.pullsFromPurchase > 0)

    const bestPurchase = allPurchases.length > 0
      ? allPurchases.reduce((best, curr) => curr.costPerPull < best.costPerPull ? curr : best)
      : null

    // Find best normal cost per pull for savings calculation
    const validNormalScenarios = normalScenarios.filter(s => s.costPerPull !== Infinity)
    const bestNormal = validNormalScenarios.length > 0
      ? validNormalScenarios.reduce((best, curr) => best.costPerPull < curr.costPerPull ? best : curr)
      : null

    const allBonusScenarios = bonusScenarios.filter(s => s.totalPulls > 0)

    // Calculate savings
    const savings = allBonusScenarios.map((bonus) => {
      if (!bestNormal || bestNormal.costPerPull === Infinity) return 0
      return Math.max(0, bonus.totalPulls * bestNormal.costPerPull - bonus.totalCost)
    })

    const maxSavings = savings.length > 0 ? Math.max(...savings) : 0
    const avgSavings = savings.length > 0 ? savings.reduce((sum, val) => sum + val, 0) / savings.length : 0

    const bestScenario = allBonusScenarios.length > 0
      ? allBonusScenarios.reduce((best, s) => s.costPerPull < best.costPerPull ? s : best)
      : (bonusScenarios.length > 0 ? bonusScenarios[0] : (normalScenarios.length > 0 ? normalScenarios[0] : null))

    return {
      maxSavings,
      bestPurchase,
      bestScenario,
      avgSavings,
      bestPurchaseName: bestPurchase?.name || '',
    }
  }

  function analyzeGame(gameId: string): GameAnalysisResult | null {
    const gameData = getGameById(gameId)
    if (!gameData) {
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
        insights,
      }
    }
    catch (error) {
      throw new Error(`Error analyzing game '${gameId}': ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  function getProcessedPurchases(gameId: string): Record<string, ProcessedPurchase[]> | null {
    const gameData = getGameById(gameId)
    if (!gameData) {
      return null
    }

    const pullCost = gameData.metadata.pull.cost
    const result: Record<string, ProcessedPurchase[]> = {}

    for (const [type, purchases] of Object.entries(gameData.packages)) {
      if (purchases) {
        result[type] = purchases.map(pkg => processPurchase(pkg, pullCost))
      }
    }

    return result
  }

  function generateChartsFromPurchases(
    processedPurchases: Record<string, ProcessedPurchase[]>,
  ) {
    const scatterData: Array<{ x: number, y: number, purchaseName: string, type: string }> = []
    const barData: Record<string, Array<{ purchase: string, costPerPull: number }>> = {}

    // Process all purchase types
    for (const [type, purchases] of Object.entries(processedPurchases)) {
      if (!purchases) continue

      purchases.forEach((pkg) => {
        // Add to scatter chart data
        scatterData.push({
          x: pkg.pullsFromPurchase,
          y: pkg.price,
          purchaseName: pkg.name,
          type,
        })

        // Add to bar chart data (only if has pulls)
        if (pkg.pullsFromPurchase > 0) {
          if (!barData[type]) barData[type] = []
          barData[type].push({
            purchase: pkg.name,
            costPerPull: pkg.costPerPull,
          })
        }
      })
    }

    return { scatterData, barData }
  }

  return {
    processPurchase,
    createScenario,
    generateScenarios,
    generateChartData,
    generateChartsFromPurchases,
    generateInsights,
    analyzeGame,
    getProcessedPurchases,
  }
}
