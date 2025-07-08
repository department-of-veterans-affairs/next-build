import {
  getHtmlFromDrupalContent,
  GetHtmlFromDrupalContentOptions,
} from './getHtmlFromDrupalContent'

describe('getHtmlFromDrupalContent', () => {
  test('should apply createPhoneLinks transformation', () => {
    const input = 'Call us at 555-123-4567 for help'
    const result = getHtmlFromDrupalContent(input)
    expect(result).toContain(
      '<va-telephone contact="555-123-4567" extension=""></va-telephone>'
    )
  })

  test('should apply drupalToVaPath transformation for images', () => {
    const input =
      '<a href="https://va.gov/sites/default/files/image.jpg">Image</a>'
    const result = getHtmlFromDrupalContent(input)
    expect(result).toBe('<a href="/img/image.jpg">Image</a>')
  })

  test('should apply drupalToVaPath transformation for files', () => {
    const input =
      '<a href="https://va.gov/sites/default/files/document.pdf">Document</a>'
    const result = getHtmlFromDrupalContent(input)
    expect(result).toBe('<a href="/files/document.pdf">Document</a>')
  })

  test('should apply newlinesToBr transformation when convertNewlines is true', () => {
    const input = 'Line 1\nLine 2\nLine 3'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: true })
    expect(result).toBe('Line 1<br>Line 2<br>Line 3')
  })

  test('should not convert newlines when convertNewlines is false', () => {
    const input = 'Line 1\nLine 2\nLine 3'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: false })
    expect(result).toBe('Line 1\nLine 2\nLine 3')
  })

  test('should not convert newlines when no options provided', () => {
    const input = 'Line 1\nLine 2\nLine 3'
    const result = getHtmlFromDrupalContent(input)
    expect(result).toBe('Line 1\nLine 2\nLine 3')
  })

  test('should apply all transformations in sequence', () => {
    const input =
      'Call 555-123-4567\nVisit <a href="https://va.gov/sites/default/files/info.pdf">this file</a>\nFor more info'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: true })

    // Should contain phone link
    expect(result).toContain(
      '<va-telephone contact="555-123-4567" extension=""></va-telephone>'
    )
    // Should contain file path transformation
    expect(result).toContain('/files/info.pdf')
    // Should contain br tags for newlines
    expect(result).toContain('<br>')
  })

  test('should handle empty string', () => {
    const input = ''
    const result = getHtmlFromDrupalContent(input)
    expect(result).toBe('')
  })

  test('should handle content with no transformations needed', () => {
    const input = 'Simple text with no special content'
    const result = getHtmlFromDrupalContent(input)
    expect(result).toBe('Simple text with no special content')
  })

  test('should handle complex content with all transformation types', () => {
    const input =
      'Contact: 555-123-4567\nDownload: <a href="https://va.gov/sites/default/files/form.pdf">Form</a>\nImage: <a href="https://va.gov/sites/default/files/photo.jpg">Photo</a>\nThank you!'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: true })

    // Check phone number transformation
    expect(result).toContain(
      '<va-telephone contact="555-123-4567" extension=""></va-telephone>'
    )

    // Check file path transformations
    expect(result).toContain('/files/form.pdf')
    expect(result).toContain('/img/photo.jpg')

    // Check newline transformations
    expect(result).toContain('<br>')

    // Verify structure is maintained
    expect(result).toContain('Contact:')
    expect(result).toContain('Download:')
    expect(result).toContain('Image:')
    expect(result).toContain('Thank you!')
  })

  test('should handle mixed newline patterns', () => {
    const input = 'Start\n\nMiddle\n\n\nEnd'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: true })
    expect(result).toBe('Start<br><br>Middle<br><br><br>End')
  })

  test('should preserve existing HTML while adding transformations', () => {
    const input = '<p>Call 555-123-4567</p>\n<div>More content</div>'
    const result = getHtmlFromDrupalContent(input, { convertNewlines: true })

    // Should preserve HTML tags
    expect(result).toContain('<p>')
    expect(result).toContain('</p>')
    expect(result).toContain('<div>')
    expect(result).toContain('</div>')

    // Should add phone link
    expect(result).toContain(
      '<va-telephone contact="555-123-4567" extension=""></va-telephone>'
    )

    // Should convert newline to br
    expect(result).toContain('<br>')
  })

  test('should handle empty options object', () => {
    const input = 'Line 1\nLine 2'
    const result = getHtmlFromDrupalContent(input, {})
    expect(result).toBe('Line 1\nLine 2') // Should not convert newlines
  })

  test('should handle options with convertNewlines undefined', () => {
    const input = 'Line 1\nLine 2'
    const options: GetHtmlFromDrupalContentOptions = {
      convertNewlines: undefined,
    }
    const result = getHtmlFromDrupalContent(input, options)
    expect(result).toBe('Line 1\nLine 2') // Should not convert newlines when undefined
  })
})
