import { getHtmlFromField } from './getHtmlFromField'

describe('getHtmlFromField', () => {
  it('returns an empty string if no input is provided', () => {
    expect(getHtmlFromField()).toBe('')
  })

  it('returns the processed field as-is if no filters apply', () => {
    const input = {
      processed: '<p>This is plain content without links or phones.</p>',
    }
    expect(getHtmlFromField(input)).toBe(input.processed)
  })

  it('applies createPhoneLinks to the content', () => {
    const input = {
      processed: '<p>Call us at 800-123-4567.</p>',
    }
    const result = getHtmlFromField(input)
    expect(result).toContain(
      '<va-telephone contact="800-123-4567" extension=""></va-telephone>'
    )
  })

  it('applies drupalToVaPath to image URLs', () => {
    const input = {
      processed:
        '<a href="https://prod.cms.va.gov/sites/default/files/image.jpg">Image</a>',
    }
    const result = getHtmlFromField(input)
    expect(result).toContain('href="/img/image.jpg"')
  })

  it('applies both filters in order', () => {
    const input = {
      processed: `
        <p>Call 800-123-4567</p>
        <a href="https://prod.cms.va.gov/sites/default/files/image.jpg">Image</a>
      `,
    }
    const result = getHtmlFromField(input)
    expect(result).toContain(
      '<va-telephone contact="800-123-4567" extension=""></va-telephone>'
    )
    expect(result).toContain('href="/img/image.jpg"')
  })
})
