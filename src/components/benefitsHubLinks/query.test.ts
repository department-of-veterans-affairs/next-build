/**
 * @jest-environment node
 */

import { NodeLandingPage } from '@/types/drupal/node'
import mockData from './mock.json'
import { formatter } from './query'

// field_related_office is causing issues here, I believe because the referenced node is unpublished (node/38439)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeBenefitsHubMock: NodeLandingPage[] = mockData

describe('BenefitsHubLinks formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = formatter(nodeBenefitsHubMock)
    expect(formattedData).toMatchSnapshot()
  })

  test('returns null when input is null', () => {
    expect(formatter(null)).toBeNull()
  })

  test('returns null when input is empty array', () => {
    expect(formatter([])).toBeNull()
  })

  test('returns null when input is undefined', () => {
    expect(formatter(undefined)).toBeNull()
  })

  test('returns null when all items have empty path', () => {
    const noPathMock = [
      {
        id: '1',
        path: null,
        title: 'Test',
        field_home_page_hub_label: 'Label',
        field_teaser_text: 'Teaser',
      },
      {
        id: '2',
        path: { alias: '' },
        title: 'Test 2',
        field_home_page_hub_label: 'Label 2',
        field_teaser_text: 'Teaser 2',
      },
    ]
    expect(formatter(noPathMock as NodeLandingPage[])).toBeNull()
  })

  test('filters out items with empty path and returns valid items', () => {
    const mixedPathMock = [
      {
        id: '1',
        path: null,
        title: 'No Path',
        field_home_page_hub_label: 'No Path',
        field_teaser_text: 'Teaser',
      },
      {
        id: '2',
        path: { alias: '/valid-path' },
        title: 'Valid',
        field_home_page_hub_label: 'Valid',
        field_teaser_text: 'Teaser',
      },
    ]
    const result = formatter(mixedPathMock as NodeLandingPage[])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: '2',
      path: '/valid-path',
      title: 'Valid',
      label: 'Valid',
      teaserText: 'Teaser',
    })
  })

  test('filters out null items from array', () => {
    const withNullMock = [
      nodeBenefitsHubMock[0],
      null,
      nodeBenefitsHubMock[1],
    ] as NodeLandingPage[]
    const result = formatter(withNullMock)
    expect(result).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
  })
})
