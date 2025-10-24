import {
  conditionalAttr,
  truncateWordsOrChar,
  regionBaseURL,
  isRelative,
  isValidData,
  drupalToVaPath,
  toString,
  escape,
  formatDate,
  newlinesToBr,
  addHeadingIds,
  addH2Ids,
  addH3Ids,
  convertActionLinks,
  setPTag,
} from './helpers'

describe('truncateWordsOrChar', () => {
  // Truncating Words Mode
  test('should truncate words when string length is greater than specified length', () => {
    const result = truncateWordsOrChar('Lorem ipsum dolor sit amet', 3, true)
    expect(result).toBe('Lorem ipsum dolor...')
  })

  test('should not truncate words when string length is less than or equal to specified length', () => {
    const result = truncateWordsOrChar('Lorem ipsum dolor sit amet', 5, true)
    expect(result).toBe('Lorem ipsum dolor sit amet')
  })

  test('should handle strings with special characters or punctuation for words', () => {
    const result = truncateWordsOrChar('Hello, World!', 1, true)
    expect(result).toBe('Hello,...')
  })

  // Truncating Characters Mode
  test('should truncate characters when string length is greater than specified length', () => {
    const result = truncateWordsOrChar('Lorem ipsum dolor sit amet', 10, false)
    expect(result).toBe('Lorem ipsu...')
  })

  test('should not truncate characters when string length is less than or equal to specified length', () => {
    const result = truncateWordsOrChar('Lorem ipsum dolor sit amet', 30, false)
    expect(result).toBe('Lorem ipsum dolor sit amet')
  })

  test('should handle strings with special characters or punctuation for characters', () => {
    const result = truncateWordsOrChar('Hello, World!', 5, false)
    expect(result).toBe('Hello...')
  })
})

describe('regionBaseURL', () => {
  test('should return "some" when path does not contain a valid region base URL', () => {
    const path = '/some/invalid/path'
    const result = regionBaseURL(path)
    expect(result).toBe('some')
  })

  test('should return undefined when path is not provided', () => {
    const result = regionBaseURL(undefined)
    expect(result).toBeUndefined()
  })
})

describe('isRelative', () => {
  test('should return true for an empty string', () => {
    const url = ''
    const result = isRelative(url)
    expect(result).toBe(true)
  })

  test('should return true for null or undefined', () => {
    const resultNull = isRelative(null)
    const resultUndefined = isRelative(undefined)
    expect(resultNull).toBe(true)
    expect(resultUndefined).toBe(true)
  })
})

describe('isValidData', () => {
  test('should return true for valid data', () => {
    const validData = 'example'
    const result = isValidData(validData)
    expect(result).toBe(true)
  })

  test('should return false for null data', () => {
    const nullData = null
    const result = isValidData(nullData)
    expect(result).toBe(false)
  })

  test('should return false for undefined data', () => {
    const undefinedData = undefined
    const result = isValidData(undefinedData)
    expect(result).toBe(false)
  })
})

describe('drupalToVaPath', () => {
  test('should replace image links with correct path', () => {
    const content =
      '<a href="https://va.gov/sites/default/files/image.jpg">Image Link</a>'
    const expectedOutput = '<a href="/img/image.jpg">Image Link</a>'
    const result = drupalToVaPath(content)
    expect(result).toBe(expectedOutput)
  })

  test('should replace file links with correct path', () => {
    const content =
      '<a href="https://va.gov/sites/default/files/document.pdf">File Link</a>'
    const expectedOutput = '<a href="/files/document.pdf">File Link</a>'
    const result = drupalToVaPath(content)
    expect(result).toBe(expectedOutput)
  })

  test('should handle content with mixed image and file links', () => {
    const content =
      '<a href="https://va.gov/sites/default/files/image.jpg">Image Link</a> <a href="https://va.gov/sites/default/files/document.pdf">File Link</a>'
    const expectedOutput =
      '<a href="/img/image.jpg">Image Link</a> <a href="/files/document.pdf">File Link</a>'
    const result = drupalToVaPath(content)
    expect(result).toBe(expectedOutput)
  })

  test('should handle content without any image or file links', () => {
    const content = 'No image or file links in this content'
    const result = drupalToVaPath(content)
    expect(result).toBe(content)
  })

  test('should return empty string if content is null or undefined', () => {
    const resultNull = drupalToVaPath(null)
    const resultUndefined = drupalToVaPath(undefined)
    expect(resultNull).toBe(null)
    expect(resultUndefined).toBe(undefined)
  })
})

describe('toString', () => {
  test('should convert string input to string', () => {
    const input = 'Hello'
    const result = toString(input)
    expect(result).toBe('Hello')
  })

  test('should convert number input to string', () => {
    const input = 123
    const result = toString(input)
    expect(result).toBe('123')
  })

  test('should convert boolean input to string', () => {
    const input = true
    const result = toString(input)
    expect(result).toBe('true')
  })

  test('should handle null input', () => {
    const input = null
    const result = toString(input)
    expect(result).toBe('')
  })

  test('should handle undefined input', () => {
    const input = undefined
    const result = toString(input)
    expect(result).toBe('')
  })

  test('should handle empty string input', () => {
    const input = ''
    const result = toString(input)
    expect(result).toBe('')
  })
})

describe('escape', () => {
  test('should escape special characters in the input string', () => {
    const input = '<script>alert("Hello & Goodbye")</script>'
    const result = escape(input)
    const expected =
      '&lt;script&gt;alert(&quot;Hello &amp; Goodbye&quot;)&lt;/script&gt;'
    expect(result).toBe(expected)
  })

  test('should handle empty input', () => {
    const input = ''
    const result = escape(input)
    expect(result).toBe('')
  })

  test('should handle null input', () => {
    const input = null
    const result = escape(input)
    expect(result).toBe('')
  })

  test('should handle undefined input', () => {
    const input = undefined
    const result = escape(input)
    expect(result).toBe('')
  })

  test('should not escape already escaped characters', () => {
    const input = '&lt;div&gt;Hello&lt;/div&gt;'
    const result = escape(input)
    expect(result).toBe('&lt;div&gt;Hello&lt;/div&gt;')
  })
})
describe('conditionalAttr', () => {
  describe('boolean condition', () => {
    test('should include attr when condition is true', () => {
      const result = conditionalAttr(true, 'test-attr', 'test-value')

      expect(result).toStrictEqual({
        'test-attr': 'test-value',
      })
    })

    test('should include blank attr when condition is true and value is not passed for bool', () => {
      const result = conditionalAttr(true, 'test-attr')

      expect(result).toStrictEqual({
        'test-attr': '',
      })
    })

    test('should not include attr when condition is false', () => {
      const result = conditionalAttr(false, 'test-attr', 'test-value')

      expect(result).toStrictEqual({})
    })
  })

  describe('function condition', () => {
    test('should include attr when function returns true', () => {
      const result = conditionalAttr(() => true, 'test-attr', 'test-value')

      expect(result).toStrictEqual({
        'test-attr': 'test-value',
      })
    })

    test('should include blank attr when function returns true and value is not passed for function', () => {
      const result = conditionalAttr(() => true, 'test-attr')

      expect(result).toStrictEqual({
        'test-attr': '',
      })
    })

    test('should not include attr when function returns false', () => {
      const result = conditionalAttr(() => false, 'test-attr', 'test-value')

      expect(result).toStrictEqual({})
    })
  })
})

describe('formatDate', () => {
  test('formats standard date strings correctly', () => {
    expect(formatDate('2024-03-20')).toBe('March 20, 2024')
    expect(formatDate('2024-12-25')).toBe('December 25, 2024')
    expect(formatDate('2024-01-05')).toBe('January 5, 2024')
  })

  test('handles ISO date strings with timezone offsets', () => {
    expect(formatDate('2024-03-20T10:25:28-04:00')).toBe('March 20, 2024')
    expect(formatDate('2024-03-20T14:27:39+00:00')).toBe('March 20, 2024')
  })

  test('handles UTC timestamps', () => {
    expect(formatDate('2024-03-20T14:30:00Z')).toBe('March 20, 2024')
  })

  test('maintains consistent output regardless of input timezone', () => {
    const date = '2024-03-20'
    const dateUTC = '2024-03-20T00:00:00Z'
    const dateEST = '2024-03-20T00:00:00-05:00'
    expect(formatDate(date)).toBe('March 20, 2024')
    expect(formatDate(dateUTC)).toBe('March 20, 2024')
    expect(formatDate(dateEST)).toBe('March 20, 2024')
  })

  test('handles invalid inputs', () => {
    expect(() => formatDate('invalid-date')).not.toThrow()
    expect(formatDate('invalid-date')).toBe('Invalid Date')
  })
})

describe('newlinesToBr', () => {
  test('should convert single newline to <br> tag', () => {
    const input = 'Line 1\nLine 2'
    const result = newlinesToBr(input)
    expect(result).toBe('Line 1<br>Line 2')
  })

  test('should convert multiple newlines to multiple <br> tags', () => {
    const input = 'Line 1\nLine 2\nLine 3'
    const result = newlinesToBr(input)
    expect(result).toBe('Line 1<br>Line 2<br>Line 3')
  })

  test('should convert consecutive newlines to consecutive <br> tags', () => {
    const input = 'Line 1\n\nLine 3'
    const result = newlinesToBr(input)
    expect(result).toBe('Line 1<br><br>Line 3')
  })

  test('should handle empty string', () => {
    const input = ''
    const result = newlinesToBr(input)
    expect(result).toBe('')
  })

  test('should handle string without newlines', () => {
    const input = 'No newlines here'
    const result = newlinesToBr(input)
    expect(result).toBe('No newlines here')
  })

  test('should handle newlines at the beginning and end', () => {
    const input = '\nMiddle line\n'
    const result = newlinesToBr(input)
    expect(result).toBe('<br>Middle line<br>')
  })

  test('should handle only newlines', () => {
    const input = '\n\n\n'
    const result = newlinesToBr(input)
    expect(result).toBe('<br><br><br>')
  })
})

describe('addHeadingIds', () => {
  test('should add ID to H2 element without ID', () => {
    const input = '<h2>Hello World</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe('<h2 id="hello-world">Hello World</h2>')
  })

  test('should not modify H2 element that already has an ID', () => {
    const input = '<h2 id="existing-id">Hello World</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe('<h2 id="existing-id">Hello World</h2>')
  })

  test('should preserve existing attributes when adding ID', () => {
    const input = '<h2 class="heading" data-test="value">Hello World</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 class="heading" data-test="value" id="hello-world">Hello World</h2>'
    )
  })

  test('should handle multiple H2 elements', () => {
    const input =
      '<h2>First Heading</h2><p>Some content</p><h2>Second Heading</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 id="first-heading">First Heading</h2><p>Some content</p><h2 id="second-heading">Second Heading</h2>'
    )
  })

  test('should handle H2 with special characters in text', () => {
    const input = '<h2>Hello & World: A Guide!</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 id="hello-world-a-guide">Hello & World: A Guide!</h2>'
    )
  })

  test('should handle empty or whitespace-only content', () => {
    const input = ''
    const result = addHeadingIds(input, '2')
    expect(result).toBe('')
  })

  test('should handle content without H2 elements', () => {
    const input =
      '<p>No headings here</p><h1>This is H1</h1><h3>This is H3</h3>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<p>No headings here</p><h1>This is H1</h1><h3>This is H3</h3>'
    )
  })

  test('should handle mixed case H2 tags', () => {
    const input = '<H2>Mixed Case Tag</H2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe('<H2 id="mixed-case-tag">Mixed Case Tag</H2>')
  })

  test('should handle H2 with nested HTML elements and entities', () => {
    const input = '<h2><strong>Security&nbsp;</strong></h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 id="security"><strong>Security&nbsp;</strong></h2>'
    )
  })

  test('should handle H2 with multiple nested elements and entities', () => {
    const input =
      '<h2><em>Getting</em>&nbsp;<strong>Started&nbsp;</strong>with&nbsp;<code>Code</code></h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 id="getting-started-with-code"><em>Getting</em>&nbsp;<strong>Started&nbsp;</strong>with&nbsp;<code>Code</code></h2>'
    )
  })

  test('should handle H2 with only HTML entities', () => {
    const input = '<h2>FAQ&nbsp;&amp;&nbsp;Help</h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe('<h2 id="faq-help">FAQ&nbsp;&amp;&nbsp;Help</h2>')
  })

  test('should handle H2 with complex nested structure', () => {
    const input =
      '<h2><span class="icon">📋</span>&nbsp;<strong>Important</strong>&nbsp;<em>Information</em></h2>'
    const result = addHeadingIds(input, '2')
    expect(result).toBe(
      '<h2 id="important-information"><span class="icon">📋</span>&nbsp;<strong>Important</strong>&nbsp;<em>Information</em></h2>'
    )
  })

  test('should work with other heading levels', () => {
    const input = '<h3>Hello World</h3>'
    const result = addHeadingIds(input, '3')
    expect(result).toBe('<h3 id="hello-world">Hello World</h3>')
  })
})

describe('addH2Ids', () => {
  test('adds IDs to h2s via addHeadingIds', () => {
    const input = '<h2>Hello World</h2>'
    const result = addH2Ids(input)
    expect(result).toBe('<h2 id="hello-world">Hello World</h2>')
  })
})

describe('addH3Ids', () => {
  test('adds IDs to h3s via addHeadingIds', () => {
    const input = '<h3>Hello World</h3>'
    const result = addH3Ids(input)
    expect(result).toBe('<h3 id="hello-world">Hello World</h3>')
  })
})

describe('convertActionLinks', () => {
  test('finds and converts action links', () => {
    const input =
      '<p>Hello World <a class="vads-c-action-link--green" href="/pay">Pay online, by phone, or by mail</a> <a class="vads-c-action-link--blue" href="/dont-pay">Do not pay</a></p>'
    const result = convertActionLinks(input)
    expect(result).toBe(
      '<p>Hello World <va-link-action href="/pay" text="Pay online, by phone, or by mail" type="primary" /> <va-link-action href="/dont-pay" text="Do not pay" type="secondary" /></p>'
    )
  })
  test('leaves other links alone', () => {
    const input =
      '<p>Hello World <a href="/pay">Pay online, by phone, or by mail</a></p>'
    const result = convertActionLinks(input)
    expect(result).toBe(
      '<p>Hello World <a href="/pay">Pay online, by phone, or by mail</a></p>'
    )
  })
  test('strips tags in inner text', () => {
    const input =
      '<a class="vads-c-action-link--blue" href="/foo"><strong>Pay</strong> <em>now</em></a>'
    const result = convertActionLinks(input)
    expect(result).toBe(
      '<va-link-action href="/foo" text="Pay now" type="secondary" />'
    )
  })
  test('passes attrs to component', () => {
    const input =
      '<a class="vads-c-action-link--blue" data-testid="test-me" href="/foo">Pay now</a>'
    const result = convertActionLinks(input)
    expect(result).toBe(
      '<va-link-action data-testid="test-me" href="/foo" text="Pay now" type="secondary" />'
    )
  })
})

describe('setPTag', () => {
  test('wraps non HTML string in <p>', () => {
    const input = 'Hello World'
    const result = setPTag(input)
    expect(result).toBe('<p>Hello World</p>')
  })
  test('returns raw HTML string unmodified', () => {
    const inputOne = '<p>Hello <a href="#">World</a></p>'
    const resultOne = setPTag(inputOne)
    const inputTwo = '<h2>Hello World</h2>'
    const resultTwo = setPTag(inputTwo)
    expect(resultOne).toBe('<p>Hello <a href="#">World</a></p>')
    expect(resultTwo).toBe('<h2>Hello World</h2>')
  })
  test('returns empty string without <p>', () => {
    const input = ' '
    const result = setPTag(input)
    expect(result).toBe('')
  })
})
