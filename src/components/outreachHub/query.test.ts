/**
 * @jest-environment node
 *
 * If we don't have this, next-drupal-query will complain, thinking that it's running on
 * the client: "You should not call getQueryData on the client."
 */

import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import { NodeOffice } from '@/types/drupal/node'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { queries } from '@/lib/drupal/queries'

const mockPageQuery = jest.fn(() => mockPage as NodeOffice)

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(RESOURCE_TYPES.OFFICE, mockPageQuery)
mockDrupalQuery.getMenu.mockReturnValue(mockMenu)

function runQuery() {
  return queries.getData(RESOURCE_TYPES.OFFICE, {
    id: mockPage.id,
  })
}

describe('OutreachHub query', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockPageQuery.mockReturnValue(mockPage as NodeOffice)
    mockDrupalQuery.getMenu.mockReturnValue(mockMenu)
  })

  test('outputs formatted data', async () => {
    expect(await runQuery()).toMatchSnapshot()
  })

  test('handles null description', async () => {
    mockPageQuery.mockReturnValue({
      ...mockPage,
      field_description: null,
    } as NodeOffice)

    const result = await runQuery()

    expect(result.description).toBeNull()
  })

  test('handles null body', async () => {
    mockPageQuery.mockReturnValue({
      ...mockPage,
      field_body: null,
    } as NodeOffice)

    const result = await runQuery()

    expect(result.body).toBe('')
  })

  test('handles null menu', async () => {
    mockDrupalQuery.getMenu.mockReturnValue(null)

    const result = await runQuery()

    expect(result.menu).toBeNull()
  })
})
