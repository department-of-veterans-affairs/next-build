/**
 * @jest-environment node
 */

import { ParagraphAlert } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from '@/components/alert/mock.js'

const AlertMock: ParagraphAlert = mockResponse

describe('alert formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData('paragraph--alert', AlertMock)
    expect(formattedData).toMatchSnapshot()
  })
})
