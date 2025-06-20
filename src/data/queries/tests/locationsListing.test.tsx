/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/locationsListing.mock.json'
import { NodeLocationsListing } from '@/types/drupal/node'
import { params } from '../locationsListing'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const LocationsListingMock: NodeLocationsListing = mockData[0]

jest.mock('@/lib/drupal/query', () => ({
  ...jest.requireActual('@/lib/drupal/query'),
  fetchSingleEntityOrPreview: () => mockData[0],
  fetchAndConcatAllResourceCollectionPages: () => ({
    data: [],
  }),
  getMenu: () => ({
    items: [],
    tree: [],
  }),
}))

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    // Should include field_office
    expect(queryString).toMatch(/include=field_office/)
    expect(queryString).toMatchSnapshot()
  })
})

describe('LocationsListing formatData', () => {
  // Patch mock to ensure path.alias exists and menu has a valid tree
  const patchedMock = {
    ...LocationsListingMock,
    path: { alias: '/boston-health-care/locations', pid: 3946, langcode: 'en' },
    field_office: {
      ...LocationsListingMock.field_office,
      id: '32bcb8dc-9064-4e3a-a8c5-496777967f4d',
      path: { alias: '/boston-health-care', pid: 3084, langcode: 'en' },
      field_system_menu: {
        ...LocationsListingMock.field_office?.field_system_menu,
        tree: [
          {
            id: '1',
            url: '/test-url',
            title: 'Test Title',
            description: 'Test Description',
            expanded: true,
            enabled: true,
            field_menu_section: 'Test Section',
            items: [],
            menu_name: 'test-menu',
            provider: 'menu_link_content',
            weight: '0',
            options: {},
            route: {
              name: 'entity.node.canonical',
              parameters: {},
            },
            type: 'menu_link_content',
            meta: {},
            parent: '',
          },
        ],
      },
    },
  }
  const formattedInput = {
    entity: patchedMock,
    menu: patchedMock.field_office?.field_system_menu || null,
    mainFacilities: [],
  }

  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--locations_listing', formattedInput)
    ).toMatchSnapshot()
  })

  test('includes a properly structured sidebar menu', () => {
    const formatted = queries.formatData(
      'node--locations_listing',
      formattedInput
    )
    expect(formatted.menu).toBeDefined()
    expect(formatted.menu).toHaveProperty('rootPath')
    expect(formatted.menu).toHaveProperty('data')
    expect(formatted.menu.data).toHaveProperty('links')
    expect(Array.isArray(formatted.menu.data.links)).toBe(true)
  })

  test('includes mainFacilities array', () => {
    const formatted = queries.formatData(
      'node--locations_listing',
      formattedInput
    )
    expect(formatted.mainFacilities).toBeDefined()
    expect(Array.isArray(formatted.mainFacilities)).toBe(true)
  })

  test('outputs formatted data via getData', async () => {
    expect(
      await queries.getData(RESOURCE_TYPES.LOCATIONS_LISTING, {
        id: mockData[0].id,
      })
    ).toMatchSnapshot()
  })
})
