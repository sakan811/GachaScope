import { describe, it, expect } from 'vitest'
import { getGameById, getAllGames } from '~/utils/gameRegistry'
import { formatCurrency, formatNumber, calculateEfficiency } from '~/utils/utilities'

describe('Utils Unit Tests', () => {
  describe('gameRegistry', () => {
    it('retrieves HSR game data', () => {
      const hsr = getGameById('hsr')
      
      expect(hsr).toBeTruthy()
      expect(hsr.metadata.id).toBe('hsr')
      expect(hsr.metadata.name).toContain('Honkai')
      expect(hsr.packages.normal.length).toBeGreaterThan(0)
    })

    it('returns null for invalid game', () => {
      const invalid = getGameById('invalid_game')
      expect(invalid).toBeNull()
    })

    it('lists all available games', () => {
      const games = getAllGames()
      
      expect(Array.isArray(games)).toBe(true)
      expect(games.length).toBeGreaterThan(0)
      expect(games.some(g => g.metadata.id === 'hsr')).toBe(true)
    })
  })

  describe('utilities', () => {
    it('formats currency values', () => {
      expect(formatCurrency(10.5)).toBe('$10.50')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1234567)).toBe('1,234,567')
      expect(formatNumber(100)).toBe('100')
    })

    it('calculates efficiency correctly', () => {
      const efficiency = calculateEfficiency(1000, 10) // 1000 amount for $10
      expect(efficiency).toBe(100) // 100 per dollar
      
      const zeroPrice = calculateEfficiency(100, 0)
      expect(zeroPrice).toBe(0) // Handle zero price
    })

    it('handles edge cases', () => {
      expect(formatCurrency(Infinity)).toBe('$∞')
      expect(formatNumber(NaN)).toBe('0')
      expect(calculateEfficiency(-100, 10)).toBe(0) // Negative amount
    })
  })
})