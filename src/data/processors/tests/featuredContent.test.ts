import { processFeaturedContent } from '../featuredContent'
import { FormattingError } from '../../errors/formatting'
import type { ParagraphCCFeaturedContent } from '@/types/drupal/paragraph'
import type { CCString, FieldFormattedText } from '@/types/drupal/field_type'

describe('processFeaturedContent', () => {
  const mockValidFeaturedContent: ParagraphCCFeaturedContent = {
    target_id: '123',
    fetched: {
      field_cta: [
        {
          pid: '456',
          target_id: '456',
          type: 'paragraph--button',
          field_button_label: [{ value: 'Click Me' }],
          field_button_link: [
            {
              uri: 'https://example.com',
              title: 'Click Me',
              url: { path: '/example' },
            },
          ],
        },
      ],
      field_description: [
        {
          value: 'Test Description',
          format: 'full_html',
          processed: 'Test Description',
        },
      ],
      field_section_header: [{ value: 'Test Header' }],
    },
  }

  it('should process valid featured content data correctly', () => {
    const result = processFeaturedContent(mockValidFeaturedContent)
    expect(result).toEqual({
      type: 'paragraph--featured_content',
      id: '123',
      description: 'Test Description',
      title: 'Test Header',
      link: {
        id: '456',
        label: 'Click Me',
        url: '/example',
      },
    })
  })

  it('should return null when input is null', () => {
    const result = processFeaturedContent(null)
    expect(result).toBeNull()
  })

  it('should throw FormattingError when description is missing', () => {
    const invalidFeaturedContent: ParagraphCCFeaturedContent = {
      target_id: '123',
      fetched: {
        field_cta: [
          {
            pid: '456',
            target_id: '456',
            type: 'paragraph--button',
            field_button_label: [{ value: 'Click Me' }],
            field_button_link: [
              {
                uri: 'https://example.com',
                title: 'Click Me',
                url: { path: '/example' },
              },
            ],
          },
        ],
        field_description: [],
        field_section_header: [{ value: 'Test Header' }],
      },
    }

    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      FormattingError
    )
    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      'ccStringArrToString: value missing'
    )
  })

  it('should throw FormattingError when header is missing', () => {
    const invalidFeaturedContent: ParagraphCCFeaturedContent = {
      target_id: '123',
      fetched: {
        field_cta: [
          {
            pid: '456',
            target_id: '456',
            type: 'paragraph--button',
            field_button_label: [{ value: 'Click Me' }],
            field_button_link: [
              {
                uri: 'https://example.com',
                title: 'Click Me',
                url: { path: '/example' },
              },
            ],
          },
        ],
        field_description: [
          {
            value: 'Test Description',
            format: 'full_html',
            processed: 'Test Description',
          },
        ],
        field_section_header: [],
      },
    }

    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      FormattingError
    )
    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      'ccStringArrToString: value missing'
    )
  })

  it('should throw FormattingError when CTA is invalid', () => {
    const invalidFeaturedContent: ParagraphCCFeaturedContent = {
      target_id: '123',
      fetched: {
        field_cta: [
          {
            pid: '456',
            target_id: '456',
            type: 'paragraph--button',
            field_button_label: [],
            field_button_link: [
              {
                uri: 'https://example.com',
                title: 'Click Me',
                url: { path: '/example' },
              },
            ],
          },
        ],
        field_description: [
          {
            value: 'Test Description',
            format: 'full_html',
            processed: 'Test Description',
          },
        ],
        field_section_header: [{ value: 'Test Header' }],
      },
    }

    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      FormattingError
    )
    expect(() => processFeaturedContent(invalidFeaturedContent)).toThrow(
      'cta:link or label missing: should only be used on a Cta'
    )
  })
})
