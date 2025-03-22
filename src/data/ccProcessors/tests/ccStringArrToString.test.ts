import type { CCString } from '@/types/drupal/field_type'
import { ccStringArrToString } from '../ccStringArrToString'
import { FormattingError } from '../../errors/formatting'

describe('ccStringArrToString', () => {
  it('should process valid string array correctly', () => {
    const validString: CCString[] = [{ value: 'Test String' }]
    const result = ccStringArrToString(validString)
    expect(result).toBe('Test String')
  })
  it('should process valid string array correctly when empty string is provided', () => {
    const validString: CCString[] = [{ value: '' }] // empty string is ok
    const result = ccStringArrToString(validString)
    expect(result).toBe('')
  })
  it('should throw FormattingError when value is undefined', () => {
    const invalidString: CCString[] = [{ value: undefined }]
    expect(() => ccStringArrToString(invalidString)).toThrow(FormattingError)
    expect(() => ccStringArrToString(invalidString)).toThrow(
      'ccStringArrToString: value missing'
    )
  })
})
