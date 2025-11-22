/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from '@/components/vamcSystemVaPolice/mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

jest.mock('@/lib/drupal/query')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockDrupalQuery = require('@/lib/drupal/query')

mockDrupalQuery.setSingleEntityMock(
  RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE,
  () => mockData
)
mockDrupalQuery.getMenu.mockReturnValue({
  items: [],
  tree: [],
})

describe('VamcSystemVaPolice formatData', () => {
  test('outputs formatted data', async () => {
    const result = await queries.getData(
      RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE, // Use the correct resource type
      { id: mockData.id }
    )
    expect(result).toMatchSnapshot()
  })
})
