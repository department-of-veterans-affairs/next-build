/**
 * @jest-environment node
 */

import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/healthCareLocalFacility.mock.json'
import { DrupalMenuLinkContent } from 'next-drupal'
import { params } from '../healthCareLocalFacility'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const menuItem: DrupalMenuLinkContent = {
  title: 'Foo',
  type: 'meh',
  url: '/nowhere/in-particular',
  id: 'foo',
  description: 'bar',
  enabled: true,
  expanded: true,
  menu_name: 'baz',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: jest.fn(() => mockData),
  getMenu: jest.fn(() => ({
    items: [menuItem],
    tree: [menuItem],
  })),
}))

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_region_page/)
  })
})

describe('HealthCareLocalFacility formatData', () => {
  test('outputs formatted data', async () => {
    expect(
      await queries.getData(RESOURCE_TYPES.VAMC_FACILITY, { id: mockData.id })
    ).toMatchSnapshot()
  })
})
