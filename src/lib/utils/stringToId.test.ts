import { stringToId } from './stringToId'

describe('stringToId', () => {
  test('converts a simple string', () => {
    expect(stringToId('Prepare for your visit')).toBe('prepare-for-your-visit')
  })

  test('replaces multiple spaces with a single hyphen', () => {
    expect(stringToId('Multiple    Spaces')).toBe('multiple-spaces')
  })

  test('handles mixed case strings', () => {
    expect(stringToId('Mixed CASE String')).toBe('mixed-case-string')
  })

  test('collapses consecutive hyphens', () => {
    expect(stringToId('Consecutive--hyphens---test')).toBe(
      'consecutive-hyphens-test'
    )
  })
})
