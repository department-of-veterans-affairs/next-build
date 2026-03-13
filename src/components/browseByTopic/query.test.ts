import { formatBrowseByTopicData } from './query'
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import { TaxonomyTermLcCategories } from '@/types/drupal/taxonomy_term'

describe('formatBrowseByTopicData', () => {
  const tagsField: ParagraphAudienceTopics = {
    type: 'paragraph--audience_topics',
    id: 'test-id',
    field_topics: [
      {
        id: 'topic-1',
        name: 'Payments',
        path: { alias: '/resources/tag/payments' },
      },
    ],
    field_audience_beneficiares: null,
    field_non_beneficiares: null,
  } as ParagraphAudienceTopics

  const categoriesField: TaxonomyTermLcCategories[] = [
    {
      id: 'cat-1',
      name: 'Disability',
      path: { alias: '/resources/disability' },
    } as TaxonomyTermLcCategories,
  ]

  test('returns null when both fields are empty', () => {
    expect(formatBrowseByTopicData(null, null)).toBeNull()
    expect(formatBrowseByTopicData(undefined, [])).toBeNull()
    expect(
      formatBrowseByTopicData(
        {
          ...tagsField,
          field_topics: [],
          field_audience_beneficiares: null,
          field_non_beneficiares: null,
        } as ParagraphAudienceTopics,
        []
      )
    ).toBeNull()
  })

  test('returns BrowseByTopicData when tags field has data', () => {
    const result = formatBrowseByTopicData(tagsField, null)
    expect(result).not.toBeNull()
    expect(result?.tags).toHaveLength(1)
    expect(result?.tags[0].name).toBe('Payments')
    expect(result?.categories).toHaveLength(0)
  })

  test('returns BrowseByTopicData when categories field has data', () => {
    const result = formatBrowseByTopicData(null, categoriesField)
    expect(result).not.toBeNull()
    expect(result?.tags).toHaveLength(0)
    expect(result?.categories).toHaveLength(1)
    expect(result?.categories[0].name).toBe('Disability')
    expect(result?.categories[0].categoryLabel).toBe('Resources and Support')
  })

  test('returns combined tags and categories when both have data', () => {
    const result = formatBrowseByTopicData(tagsField, categoriesField)
    expect(result).not.toBeNull()
    expect(result?.tags).toHaveLength(1)
    expect(result?.categories).toHaveLength(1)
  })
})
