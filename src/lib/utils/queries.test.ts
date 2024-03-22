import { ParamsType } from '@/data/queries'
import { getNestedIncludes } from './queries'

jest.mock('@/data/queries', () => ({
  queries: {
    getParams: jest.fn().mockReturnValue({
      getQueryObject: () => ({
        include: 'field_a,field_b',
      }),
    }),
  },
}))

describe('getNestedIncludes', () => {
  describe('fieldName is provided', () => {
    test('should return included fields prepended with fieldName', () => {
      const result = getNestedIncludes(
        'some_field',
        'mock_param_type' as ParamsType
      )

      expect(result).toStrictEqual([
        'some_field',
        'some_field.field_a',
        'some_field.field_b',
      ])
    })
  })

  describe('fieldName is not provided', () => {
    test('should return included fields as is', () => {
      const result = getNestedIncludes(null, 'mock_param_type' as ParamsType)

      expect(result).toStrictEqual(['field_a', 'field_b'])
    })
  })
})
