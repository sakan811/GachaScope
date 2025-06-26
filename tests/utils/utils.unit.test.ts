import { describe, it, expect } from 'vitest'
import { getGameById, getAllGames, getGameMetadata, isValidGameId, getGameNames } from '~/utils/gameRegistry'

describe('Utils Unit Tests', () => {
  describe('gameRegistry', () => {
    it('retrieves HSR game data', () => {
      const hsr = getGameById('hsr')

      expect(hsr).toBeTruthy()
      expect(hsr?.metadata.id).toBe('hsr')
      expect(hsr?.metadata.name).toContain('Honkai')
      expect(hsr?.packages.normal.length).toBeGreaterThan(0)
    })

    it('returns undefined for invalid game', () => {
      const invalid = getGameById('invalid_game')
      expect(invalid).toBeFalsy()
    })

    it('lists all available games', () => {
      const games = getAllGames()

      expect(Array.isArray(games)).toBe(true)
      expect(games.length).toBeGreaterThan(0)
      expect(games.some(g => g.metadata.id === 'hsr')).toBe(true)
    })

    it('gets game metadata', () => {
      const metadata = getGameMetadata('hsr')

      expect(metadata).toBeTruthy()
      expect(metadata?.id).toBe('hsr')
      expect(metadata?.name).toContain('Honkai')
      expect(metadata?.pull.cost).toBe(160)
    })

    it('validates game IDs', () => {
      expect(isValidGameId('hsr')).toBe(true)
      expect(isValidGameId('invalid')).toBe(false)
    })

    it('gets game names list', () => {
      const names = getGameNames()

      expect(Array.isArray(names)).toBe(true)
      expect(names.length).toBeGreaterThan(0)

      const hsrName = names.find(n => n.id === 'hsr')
      expect(hsrName).toBeTruthy()
      expect(hsrName?.name).toContain('Honkai')
      expect(hsrName?.shortName).toBe('HSR')
    })

    it('handles edge cases', () => {
      expect(getGameById('')).toBeFalsy()
      expect(getGameMetadata('')).toBeFalsy()
      expect(isValidGameId('')).toBe(false)
    })
  })
})
