/**
 * @jest-environment node
 */

import { ParagraphTable } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from '@/components/table/mock'

const TableMock = mockResponse as ParagraphTable

describe('table formatData', () => {
  test('outputs formatted data', () => {
    expect(queries.formatData('paragraph--table', TableMock)).toMatchSnapshot()
  })
})
