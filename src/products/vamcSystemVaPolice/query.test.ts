/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/products/vamcSystemVaPolice/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes' // Import RESOURCE_TYPES

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData, // Mock fetchSingleEntityOrPreview
  getMenu: () => ({
    items: [],
    tree: [],
  }),
}))

describe('VamcSystemVaPolice formatData', () => {
  test('outputs formatted data', async () => {
    const result = await queries.getData(
      RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE, // Use the correct resource type
      { id: mockData.id }
    )
    expect(result).toMatchSnapshot()
  })
})
