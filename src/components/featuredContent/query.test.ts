/**
 * @jest-environment node
 */

import { ParagraphFeaturedContent } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/featuredContent/mock.json'
import { params } from './query'

const featuredContentMock = mockData as ParagraphFeaturedContent

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_cta/)
  })
})
test('returns null when entity is null', () => {
  const result = queries.formatData('paragraph--featured_content', null)
  expect(result).toBeNull()
})

describe('FeaturedContent formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--featured_content', featuredContentMock)
    ).toMatchSnapshot()
  })
  test('handles undefined fields gracefully', () => {
    const modifiedMock = {
      ...featuredContentMock,
      field_description: { value: null, format: null, processed: null },
      field_cta: null,
    }
    const formattedData = queries.formatData(
      'paragraph--featured_content',
      modifiedMock
    )

    expect(formattedData.description).toBeNull()
    expect(formattedData.link).toBeNull()
  })
})
