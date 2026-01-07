import { describe, it, expect } from 'vitest'

describe('useApi', () => {
  it('should export useApi function', async () => {
    const module = await import('~/composables/useApi')
    expect(module.useApi).toBeDefined()
    expect(typeof module.useApi).toBe('function')
  })

  it('should be importable', () => {
    expect(async () => {
      await import('~/composables/useApi')
    }).not.toThrow()
  })
})
