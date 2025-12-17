/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

// Mock the getMenu function
jest.mock('@/lib/drupal/query', () => ({
  getMenu: jest.fn((menuName: string) => mockData),
}))

describe('HomePageCommonTasks query', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('outputs formatted data', async () => {
    expect(await queries.getData('home-page-benefits')).toMatchSnapshot()
  })
})
