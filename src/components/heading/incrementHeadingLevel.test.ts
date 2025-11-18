import { incrementHeadingLevel } from './incrementHeadingLevel'

describe('incrementHeadingLevel', () => {
  it('increments h1 to h2', () => {
    expect(incrementHeadingLevel('h1')).toBe('h2')
  })

  it('increments h2 to h3', () => {
    expect(incrementHeadingLevel('h2')).toBe('h3')
  })

  it('increments h3 to h4', () => {
    expect(incrementHeadingLevel('h3')).toBe('h4')
  })

  it('increments h4 to h5', () => {
    expect(incrementHeadingLevel('h4')).toBe('h5')
  })

  it('increments h5 to h6', () => {
    expect(incrementHeadingLevel('h5')).toBe('h6')
  })

  it('keeps h6 as h6', () => {
    expect(incrementHeadingLevel('h6')).toBe('h6')
  })
})
