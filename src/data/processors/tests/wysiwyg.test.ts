import { processWysiwyg } from '../wysiwyg'
import { FormattingError } from '../../errors/formatting'
import type { FieldFormattedText } from '@/types/drupal/field_type'
import { cloneDeep } from 'lodash'

describe('processWysiwyg', () => {
  const mockValidWysiwyg: FieldFormattedText = {
    value: '<p>Test HTML</p>',
    format: 'full_html',
    processed: '<p>Test HTML</p>',
  }

  const mockValidWysiwygArray: FieldFormattedText[] = [mockValidWysiwyg]

  it('should process valid wysiwyg data correctly when passed as array', () => {
    const result = processWysiwyg({ field_wysiwyg: mockValidWysiwygArray })
    expect(result).toEqual({
      html: '<p>Test HTML</p>',
    })
  })

  it('should process valid wysiwyg data correctly when passed as single item', () => {
    const result = processWysiwyg({ field_wysiwyg: mockValidWysiwyg })
    expect(result).toEqual({
      html: '<p>Test HTML</p>',
    })
  })

  it('should throw FormattingError when field_wysiwyg is missing', () => {
    expect(() => processWysiwyg({ field_wysiwyg: null })).toThrow(
      FormattingError
    )
    expect(() => processWysiwyg({ field_wysiwyg: null })).toThrow('missing')
  })

  it('should throw FormattingError when field_wysiwyg is undefined', () => {
    expect(() => processWysiwyg({ field_wysiwyg: undefined })).toThrow(
      FormattingError
    )
    expect(() => processWysiwyg({ field_wysiwyg: undefined })).toThrow(
      'missing wysiwyg field'
    )
  })
})
