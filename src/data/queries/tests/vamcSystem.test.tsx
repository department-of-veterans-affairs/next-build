/**
 * @jest-environment node
 */

import { NodeVamcSystem } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcSystem.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../vamcSystem'
import { Menu } from '@/types/drupal/menu'

// Using type assertion since this is just test data
const VamcSystemMock = mockData as unknown as NodeVamcSystem
const mockMenu: Menu = {
  items: [],
  tree: [],
}

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_media/)
    expect(queryString).toMatch(/include=field_media.image/)
    expect(queryString).toMatch(/include=field_administration/)
    expect(queryString).toMatch(/include=field_clinical_health_services/)
    expect(queryString).toMatch(/include=field_related_links/)
  })
})

describe('VamcSystem formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(RESOURCE_TYPES.VAMC_SYSTEM, {
        entity: VamcSystemMock,
        menu: mockMenu,
      })
    ).toMatchSnapshot()
  })

  test('handles missing data correctly', () => {
    const emptyMock = {
      ...VamcSystemMock,
      field_intro_text: null,
      field_media: null,
      field_administration: null,
      field_related_links: null,
    }
    expect(
      queries.formatData(RESOURCE_TYPES.VAMC_SYSTEM, {
        entity: emptyMock,
        menu: null,
      })
    ).toMatchSnapshot()
  })
})
