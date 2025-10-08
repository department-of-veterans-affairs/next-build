import { getHeadingIdDeduper } from './headingIdDeduper'

describe('getHeadingIdDeduper', () => {
  it('should return the original content if no h2 elements with IDs are present', () => {
    const deduper = getHeadingIdDeduper()
    const content = '<p>Some content</p><h2>Heading without ID</h2>'

    expect(deduper(content)).toBe(content)
  })

  it('should return the original content if content is empty or null', () => {
    const deduper = getHeadingIdDeduper()

    expect(deduper('')).toBe('')
    expect(deduper(null)).toBe(null)
    expect(deduper(undefined)).toBe(undefined)
  })

  it('should not modify unique IDs', () => {
    const deduper = getHeadingIdDeduper()
    const content =
      '<h2 id="unique-id">Heading</h2><h2 id="another-unique">Another</h2>'

    expect(deduper(content)).toBe(content)
  })

  it('should deduplicate duplicate IDs by adding numerical suffixes', () => {
    const deduper = getHeadingIdDeduper()
    const content =
      '<h2 id="duplicate">First</h2><h2 id="duplicate">Second</h2><h2 id="duplicate">Third</h2>'
    const expected =
      '<h2 id="duplicate">First</h2><h2 id="duplicate-1">Second</h2><h2 id="duplicate-2">Third</h2>'

    expect(deduper(content)).toBe(expected)
  })

  it('should work with different quote styles', () => {
    const deduper = getHeadingIdDeduper()
    const content = `<h2 id="test">First</h2><h2 id='test'>Second</h2><h2 id=test>Third</h2>`
    const expected = `<h2 id="test">First</h2><h2 id='test-1'>Second</h2><h2 id=test-2>Third</h2>`

    expect(deduper(content)).toBe(expected)
  })

  it('should preserve other attributes on h2 elements', () => {
    const deduper = getHeadingIdDeduper()
    const content =
      '<h2 class="heading" id="test" data-attr="value">First</h2><h2 id="test" class="other">Second</h2>'
    const expected =
      '<h2 class="heading" id="test" data-attr="value">First</h2><h2 id="test-1" class="other">Second</h2>'

    expect(deduper(content)).toBe(expected)
  })

  it('should maintain state across multiple calls', () => {
    const deduper = getHeadingIdDeduper()

    const first = deduper('<h2 id="test">First call</h2>')
    const second = deduper('<h2 id="test">Second call</h2>')
    const third = deduper('<h2 id="test">Third call</h2>')

    expect(first).toBe('<h2 id="test">First call</h2>')
    expect(second).toBe('<h2 id="test-1">Second call</h2>')
    expect(third).toBe('<h2 id="test-2">Third call</h2>')
  })

  it('should initialize with provided initial IDs', () => {
    const deduper = getHeadingIdDeduper('existing-id', 'another-existing')
    const content =
      '<h2 id="existing-id">Test</h2><h2 id="another-existing">Test2</h2><h2 id="new-id">Test3</h2>'
    const expected =
      '<h2 id="existing-id-1">Test</h2><h2 id="another-existing-1">Test2</h2><h2 id="new-id">Test3</h2>'

    expect(deduper(content)).toBe(expected)
  })

  it('should handle complex HTML with mixed content', () => {
    const deduper = getHeadingIdDeduper()
    const content = `
      <div>
        <h2 id="section">Section 1</h2>
        <p>Some content</p>
        <h2 id="section">Section 2</h2>
        <ul><li>List item</li></ul>
        <h2 id="different">Different ID</h2>
        <h2 id="section">Section 3</h2>
      </div>
    `

    const result = deduper(content)

    expect(result).toContain('<h2 id="section">Section 1</h2>')
    expect(result).toContain('<h2 id="section-1">Section 2</h2>')
    expect(result).toContain('<h2 id="different">Different ID</h2>')
    expect(result).toContain('<h2 id="section-2">Section 3</h2>')
  })

  it('should handle edge case where original ID already has numerical suffix', () => {
    const deduper = getHeadingIdDeduper('test-1')
    const content = '<h2 id="test-1">First</h2><h2 id="test-1">Second</h2>'
    const expected = '<h2 id="test-1-1">First</h2><h2 id="test-1-2">Second</h2>'

    expect(deduper(content)).toBe(expected)
  })

  it('should be case sensitive with IDs', () => {
    const deduper = getHeadingIdDeduper()
    const content =
      '<h2 id="Test">First</h2><h2 id="test">Second</h2><h2 id="TEST">Third</h2>'

    // All IDs are different due to case sensitivity, so no deduplication should occur
    expect(deduper(content)).toBe(content)
  })

  it('should handle multiple separate deduplicator instances independently', () => {
    const deduper1 = getHeadingIdDeduper()
    const deduper2 = getHeadingIdDeduper()

    const result1 = deduper1('<h2 id="test">Deduper 1</h2>')
    const result2 = deduper2('<h2 id="test">Deduper 2</h2>')

    // Both should keep the original ID since they're separate instances
    expect(result1).toBe('<h2 id="test">Deduper 1</h2>')
    expect(result2).toBe('<h2 id="test">Deduper 2</h2>')

    // But subsequent calls within same instance should deduplicate
    const result1b = deduper1('<h2 id="test">Deduper 1 again</h2>')
    expect(result1b).toBe('<h2 id="test-1">Deduper 1 again</h2>')
  })
})
