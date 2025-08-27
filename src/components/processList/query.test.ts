/**
 * @jest-environment node
 */

import { ParagraphProcessList } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from '@/components/processList/mock'

const ProcessListMock: ParagraphProcessList = mockResponse

describe('ProcessList formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--process', ProcessListMock)
    ).toMatchSnapshot()
  })
})
