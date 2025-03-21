import { ccCta } from '../ccCta'
import { FormattingError } from '../../errors/formatting'
import type { CCFieldCta } from '@/types/drupal/paragraph'
import { cloneDeep } from 'lodash'

describe('ccCta', () => {
  let mockValidCta: CCFieldCta
  beforeEach(() => {
    mockValidCta = {
      pid: '123',
      target_id: '123',
      type: 'paragraph--cta',
      field_button_label: [{ value: 'Click Me' }],
      field_button_link: [
        {
          uri: 'https://example.com/a',
          title: 'Click Me',
          url: { path: 'https://example.com/b' },
        },
      ],
    }
  })

  it('should process valid CTA data correctly', () => {
    const result = ccCta([mockValidCta])
    expect(result).toEqual({
      id: '123',
      label: 'Click Me',
      url: 'https://example.com/b',
    })
  })

  it('should return null when no CTA data is provided', () => {
    const result = ccCta(undefined)
    expect(result).toBeNull()
  })

  it('should return null when empty CTA array is provided', () => {
    const result = ccCta([])
    expect(result).toBeNull()
  })

  it('should throw FormattingError when button link is missing', () => {
    const invalidCta: CCFieldCta[] = [cloneDeep(mockValidCta)]
    invalidCta[0].field_button_link = []

    expect(() => ccCta(invalidCta)).toThrow(FormattingError)
    expect(() => ccCta(invalidCta)).toThrow(
      'cta:link or label missing: should only be used on a CC CTA'
    )
  })

  it('should throw FormattingError when button label is missing', () => {
    const invalidCta: CCFieldCta[] = [cloneDeep(mockValidCta)]
    invalidCta[0].field_button_label = []

    expect(() => ccCta(invalidCta)).toThrow(FormattingError)
    expect(() => ccCta(invalidCta)).toThrow(
      'cta:link or label missing: should only be used on a CC CTA'
    )
  })
  it('should return the correct URL when the button link is a url.path', () => {
    mockValidCta.field_button_link[0].uri = undefined
    const result = ccCta([mockValidCta])
    expect(result).toEqual({
      id: '123',
      label: 'Click Me',
      url: 'https://example.com/b',
    })
  })
  it('should return the correct URL when the button link is the uri not url.path', () => {
    mockValidCta.field_button_link[0].url = undefined
    const result = ccCta([mockValidCta])
    expect(result).toEqual({
      id: '123',
      label: 'Click Me',
      url: 'https://example.com/a',
    })
  })
})
