import { conditionalAttr } from './helpers'

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
