import { conditionalAttr } from './helpers'
import { numToWord } from './helpers'

describe('conditionalAttr', () => {
  describe('boolean condition', () => {
    test('should include attr when condition is true', () => {
      const result = conditionalAttr(true, 'test-attr', 'test-value')

      expect(result).toStrictEqual({
        'test-attr': 'test-value',
      })
    })

    test('should include blank attr when condition is true and value is not passed', () => {
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

    test('should include blank attr when function returns true and value is not passed', () => {
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
