import { processCcTermExpander } from '../ccTermExpander'
import { FormattingError } from '../../errors/formatting'
import type { CcTextExpander } from '@/types/drupal/paragraph'
import type { FieldFormattedText } from '@/types/drupal/field_type'

describe('processCcTermExpander', () => {
  const mockValidTermExpander: CcTextExpander = {
    target_id: '123',
    fetched_bundle: 'text_expander',
    fetched: {
      field_text_expander: [{ value: 'Test Term' }],
      field_wysiwyg: [
        {
          value: '<p>Test HTML</p>',
          format: 'full_html',
          processed: '<p>Test HTML</p>',
        },
      ],
    },
  }

  it('should process valid term expander data correctly', () => {
    const result = processCcTermExpander(mockValidTermExpander)
    expect(result).toEqual({
      expander: 'Test Term',
      html: '<p>Test HTML</p>',
    })
  })

  it('should throw FormattingError when fetched is missing', () => {
    const invalidTermExpander: CcTextExpander = {
      target_id: '123',
      fetched_bundle: 'text_expander',
      fetched: undefined,
    }

    expect(() => processCcTermExpander(invalidTermExpander)).toThrow(
      FormattingError
    )
    expect(() => processCcTermExpander(invalidTermExpander)).toThrow(
      'CC Term Expander is missing fetched values'
    )
  })

  it('should throw FormattingError when field_text_expander is missing', () => {
    const invalidTermExpander: CcTextExpander = {
      target_id: '123',
      fetched_bundle: 'text_expander',
      fetched: {
        field_text_expander: [],
        field_wysiwyg: [
          {
            value: '<p>Test HTML</p>',
            format: 'full_html',
            processed: '<p>Test HTML</p>',
          },
        ],
      },
    }

    expect(() => processCcTermExpander(invalidTermExpander)).toThrow(
      FormattingError
    )
    expect(() => processCcTermExpander(invalidTermExpander)).toThrow(
      'CC Term Expander is missing fetched values'
    )
  })
})
