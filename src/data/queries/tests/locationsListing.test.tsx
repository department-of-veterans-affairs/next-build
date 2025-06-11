/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/locationsListing.mock.json'
import { NodeLocationsListing } from '@/types/drupal/node'
import { params } from '../locationsListing'
const LocationsListingMock: NodeLocationsListing = mockData[0]

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    // Should include field_office
    expect(queryString).toMatch(/include=field_office/)
  })
})

describe('LocationsListing formatData', () => {
  // Patch mock to ensure path.alias exists and menu has a valid tree
  const patchedMock = {
    ...LocationsListingMock,
    path: { alias: '/boston-health-care/', pid: 1, langcode: 'en' },
    field_office: {
      ...LocationsListingMock.field_office,
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

  test('handles no answers correctly', () => {
    // TODO
  })
})
