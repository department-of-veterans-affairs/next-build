/**
 * @jest-environment node
 */

import { ParagraphTable } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/components/table/mock'

const TableMock: ParagraphTable = mockResponse

describe('table formatData', () => {
  test('outputs formatted data', () => {
    expect(queries.formatData('paragraph--table', TableMock)).toMatchSnapshot()
  })
})
