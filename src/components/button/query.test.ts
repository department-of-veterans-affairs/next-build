/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphButton } from '@/types/drupal/paragraph'
import mockData from '@/mocks/button.mock.json'

const buttonMock: ParagraphButton[] = mockData

describe('paragraph--button formatData', () => {
  test('outputs formatted data', () => {
    expect(
      buttonMock.map((mock) => {
        return queries.formatData('paragraph--button', mock)
      })
    ).toMatchSnapshot()
  })
})
