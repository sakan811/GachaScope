import type { Ref } from 'vue'
import type { GameData } from '../types/games'
import type { 
  ChartOptions} from 'chart.js'

export const useChartConfig = (gameData: Ref<GameData>) => {
  const packageTypeColors = {
    normal: { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' },
    first_time_bonus: { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' },
    subscription: { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
    limited_time: { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgb(168, 85, 247)' }
  }

  const typeLabels = {
    normal: 'Normal Packages',
    first_time_bonus: 'First-Time Bonus',
    subscription: 'Subscription',
    limited_time: 'Limited Time'
  }

  const createChartOptions = (isScatter = false): ChartOptions<'bar' | 'scatter'> => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const pullName = gameData.value?.metadata?.pull.name || 'Pull'
    
    const baseOptions: ChartOptions<'bar' | 'scatter'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: false },
        legend: { 
          display: true, 
          position: 'top' as const,
          labels: { 
            font: { size: isMobile ? 10 : 12 },
            ...(isScatter && { usePointStyle: true, boxWidth: 8 })
          }
        }
      },
      scales: {
        x: {
          type: isScatter ? 'linear' as const : 'category' as const,
          position: 'bottom' as const,
          title: { 
            display: !isMobile, 
            text: isScatter ? `${pullName}s from Package` : 'Package',
            font: { size: isMobile ? 10 : 12 }
          },
          ticks: { 
            font: { size: isMobile ? (isScatter ? 9 : 8) : (isScatter ? 11 : 10) },
            ...(!isScatter && { maxRotation: isMobile ? 45 : 0 })
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          title: { 
            display: !isMobile, 
            text: isScatter ? 'Package Cost ($)' : `Cost per ${gameData.value.metadata.pull.name} ($)`,
            font: { size: isMobile ? 10 : 12 }
          },
          ticks: { font: { size: isMobile ? 9 : 11 } },
          grid: { color: 'rgba(156, 163, 175, 0.1)' }
        }
      }
    }
    
    if (isScatter) {
      const plugins = baseOptions.plugins as unknown as {
        tooltip?: {
          titleFont: { size: number }
          bodyFont: { size: number }
          callbacks: {
            title: (context: any) => string
            label: (context: any) => string
          }
        }
      }
      plugins.tooltip = {
        titleFont: { size: isMobile ? 11 : 13 },
        bodyFont: { size: isMobile ? 10 : 12 },
        callbacks: {
          title: (context: any) => context[0].raw.packageName,
          label: (context: any) => `$${context.parsed.y.toFixed(2)} for ${context.parsed.x} ${pullName.toLowerCase()}s`
        }
      }
    }
    
    return baseOptions
  }

  return {
    packageTypeColors,
    typeLabels,
    createChartOptions
  }
}
