/**
 * @jest-environment node
 */

import { ParagraphNumberCallout } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/numberCallout.mock'

const NumberCalloutMock: ParagraphNumberCallout = mockResponse

describe('NumberCallout formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--number_callout', NumberCalloutMock)
    ).toMatchSnapshot()
  })
})
