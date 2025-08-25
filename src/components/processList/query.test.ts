/**
 * @jest-environment node
 */

import { ParagraphProcessList } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/processList.mock'

const ProcessListMock: ParagraphProcessList = mockResponse

describe('ProcessList formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--process', ProcessListMock)
    ).toMatchSnapshot()
  })
})
