import {
  conditionalAttr,
  truncateWordsOrChar,
  regionBaseURL,
  isRelative,
  isValidData,
  drupalToVaPath,
  toString,
  escape,
  numToWord,
  formatDate,
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

describe('numToWord function', () => {
  test('converts single digit numbers', () => {
    expect(numToWord(1)).toBe('one')
    expect(numToWord(5)).toBe('five')
  })

  test('converts numbers below twenty', () => {
    expect(numToWord(13)).toBe('thirteen')
    expect(numToWord(19)).toBe('nineteen')
  })

  test('converts tens', () => {
    expect(numToWord(20)).toBe('twenty')
    expect(numToWord(90)).toBe('ninety')
  })

  test('converts numbers between twenty and ninety-nine', () => {
    expect(numToWord(21)).toBe('twenty-one')
    expect(numToWord(99)).toBe('ninety-nine')
  })

  test('handles zero', () => {
    expect(numToWord(0)).toBe('zero')
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
