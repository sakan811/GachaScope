import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BattlePassSection from '~/components/analysis/BattlePassSection.vue'
import { getGameById } from '~/utils/gameRegistry'
import { useGameAnalysis } from '~/composables/useGameAnalysis'

describe('BattlePassSection Component', () => {
  const { getProcessedPackages } = useGameAnalysis()
  
  it('renders battle pass section with HSR data', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!
    const battlePassPackages = processedPackages.battle_pass || []

    const component = await mountSuspended(BattlePassSection, {
      props: {
        gameData,
        battlePassPackages
      }
    })

    expect(component.text()).toContain('Battle Pass')
    expect(component.text()).toContain('Nameless Glory')
    expect(component.text()).toContain('Nameless Medal')
  })

  it('shows battle pass value analysis when packages exist', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!
    const battlePassPackages = processedPackages.battle_pass || []

    const component = await mountSuspended(BattlePassSection, {
      props: {
        gameData,
        battlePassPackages
      }
    })

    expect(component.text()).toContain('Battle Pass Value Analysis')
    expect(component.text()).toContain('Best Value')
    expect(component.text()).toContain('Total Value')
  })

  it('does not render when no battle pass packages exist', async () => {
    const gameData = getGameById('hsr')!
    const battlePassPackages: never[] = []

    const component = await mountSuspended(BattlePassSection, {
      props: {
        gameData,
        battlePassPackages
      }
    })

    expect(component.html()).toBe('<!--v-if-->')
  })

  it('formats battle pass names correctly', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!
    const battlePassPackages = processedPackages.battle_pass || []

    const component = await mountSuspended(BattlePassSection, {
      props: {
        gameData,
        battlePassPackages
      }
    })

    // Names should be formatted without extra processing since they're already clean
    expect(component.text()).toContain('Nameless Glory')
    expect(component.text()).toContain('Nameless Medal')
  })

  it('displays battle pass statistics correctly', async () => {
    const gameData = getGameById('hsr')!
    const processedPackages = getProcessedPackages('hsr')!
    const battlePassPackages = processedPackages.battle_pass || []

    const component = await mountSuspended(BattlePassSection, {
      props: {
        gameData,
        battlePassPackages
      }
    })

    expect(component.text()).toContain('Best Cost/Warp')
    expect(component.text()).toContain('Total Warps')
  })
})