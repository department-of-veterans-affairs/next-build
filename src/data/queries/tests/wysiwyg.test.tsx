/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import { ParagraphWysiwyg } from '@/types/drupal/paragraph'
import mockData from '@/mocks/wysiwyg.mock.json'

const wysiwygMock: ParagraphWysiwyg[] = mockData

describe('paragraph--wysiwyg formatData', () => {
  test('outputs formatted data', () => {
    expect(
      wysiwygMock.map((mock) => {
        return queries.formatData('paragraph--wysiwyg', mock)
      })
    ).toMatchSnapshot()
  })
})
