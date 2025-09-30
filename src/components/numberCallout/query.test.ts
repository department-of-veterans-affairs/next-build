/**
 * @jest-environment node
 */

import { ParagraphNumberCallout } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from '@/components/numberCallout/mock'

const numberCalloutMock = mockResponse as ParagraphNumberCallout

describe('NumberCallout formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--number_callout', numberCalloutMock)
    ).toMatchSnapshot()
  })
})
