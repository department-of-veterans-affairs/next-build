/**
 * @jest-environment node
 */

import { ParagraphAlert } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alert.mock.js'

const AlertMock: ParagraphAlert = mockResponse

describe('alert formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData('paragraph--alert', AlertMock)
    expect(formattedData).toMatchSnapshot()
  })
})
