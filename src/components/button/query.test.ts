/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { ParagraphButton } from '@/types/drupal/paragraph'
import mockData from '@/components/button/mock.json'

const buttonMock = mockData as ParagraphButton[]

describe('paragraph--button formatData', () => {
  test('outputs formatted data', () => {
    expect(
      buttonMock.map((mock) => {
        return queries.formatData('paragraph--button', mock)
      })
    ).toMatchSnapshot()
  })

  test('outputs null when passed null or undefined', () => {
    expect(queries.formatData('paragraph--button', null)).toBe(null)
    expect(queries.formatData('paragraph--button', undefined)).toBe(null)
  })
})
