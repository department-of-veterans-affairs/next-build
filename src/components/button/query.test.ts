/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { ParagraphButton } from '@/types/drupal/paragraph'
import mockData from '@/components/button/mock.json'

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
