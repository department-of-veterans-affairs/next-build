/**
 * @jest-environment node
 */

import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { DrupalMenuLinkContent } from 'next-drupal'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'
import facilityMock from '../vamcFacility/mock'
import { formatter, params } from './query'

const menuItem: DrupalMenuLinkContent = {
  title: 'Test Menu Item',
  type: 'menu_link_content',
  url: '/test-facility/test-service',
  id: 'test-menu-item',
  description: 'Test description',
  enabled: true,
  expanded: false,
  menu_name: 'test-menu',
  meta: {},
  options: {},
  parent: null,
  provider: null,
  route: null,
  weight: '0',
}

const mockMenu = {
  items: [menuItem],
  tree: [menuItem],
}
const VamcOperatingStatusAndAlertsMock =
  mockData as NodeVamcOperatingStatusAndAlerts

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_office,field_office.field_system_menu/
    )
  })
})

describe('VamcOperatingStatusAndAlerts formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--vamc_operating_status_and_alerts', {
        entity: VamcOperatingStatusAndAlertsMock,
        menu: null,
        facilities: [facilityMock],
      })
    ).toMatchSnapshot()
  })
  describe('Lovell variant handling', () => {
    const lovellPath = {
      alias: '/lovell-federal-health-care-va/operating-status',
      pid: 79642,
      langcode: 'en',
    }
    const lovellBreadcrumbs = [
      {
        uri: 'https://va-gov-cms.ddev.site/',
        title: 'Home',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care',
        title: 'Lovell Federal health care',
        options: [],
      },
      {
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care/operating-status',
        title: 'Operating Status',
        options: [],
      },
    ]
    test('outputs formatted data with Lovell variant', () => {
      expect(
        queries.formatData('node--vamc_operating_status_and_alerts', {
          entity: VamcOperatingStatusAndAlertsMock,
          menu: null,
          facilities: [facilityMock],
          lovell: {
            isLovellVariantPage: true,
            variant: 'tricare',
          },
        })
      ).toMatchSnapshot()
    })
    test('updates the breadcrumbs for Lovell variant', () => {
      const formattedData = queries.formatData(
        'node--vamc_operating_status_and_alerts',
        {
          entity: {
            ...VamcOperatingStatusAndAlertsMock,
            path: lovellPath,
            breadcrumbs: lovellBreadcrumbs,
          },
          menu: null,
          facilities: [facilityMock],
          lovell: {
            isLovellVariantPage: true,
            variant: 'tricare',
          },
        }
      )
      expect(formattedData.breadcrumbs[1]).toEqual({
        uri: 'https://va-gov-cms.ddev.site/lovell-federal-health-care-tricare',
        title: 'Lovell Federal health care - TRICARE',
        options: [],
      })
    })
  })
})

describe('VamcOperatingStatusAndAlerts format situation updates', () => {
  test('ignores unpublished banners', () => {
    const formattedData = formatter({
      entity: {
        ...VamcOperatingStatusAndAlertsMock,
        field_banner_alert: [
          {
            ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0],
            status: false,
          },
        ],
      },
      menu: mockMenu,
      facilities: [facilityMock],
    })
    expect(formattedData.situationUpdates).toBeNull()
  })
  test('ignores published with no situation updates', () => {
    const formattedData = formatter({
      entity: {
        ...VamcOperatingStatusAndAlertsMock,
        field_banner_alert: [
          {
            ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0],
            field_situation_updates: null,
            field_banner_alert_situationinfo: null,
          },
        ],
      },
      menu: mockMenu,
      facilities: [facilityMock],
    })
    expect(formattedData.situationUpdates).toBeNull()
  })
  test('sorts updates by most recent date', () => {
    const extraSituationUpdates = [
      ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0]
        .field_situation_updates,
      {
        ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0]
          .field_situation_updates[0],
        field_datetime_range_timezone: {
          value: '2025-09-18T21:41:00+00:00',
          end_value: '2025-09-18T22:41:00+00:00',
          duration: 60,
          rrule: null,
          rrule_index: null,
          timezone: 'America/Los_Angeles',
        },
      },
      {
        ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0]
          .field_situation_updates[0],
        field_datetime_range_timezone: {
          value: '2025-09-20T21:41:00+00:00',
          end_value: '2025-09-20T22:41:00+00:00',
          duration: 60,
          rrule: null,
          rrule_index: null,
          timezone: 'America/Los_Angeles',
        },
      },
    ]
    const formattedData = formatter({
      entity: {
        ...VamcOperatingStatusAndAlertsMock,
        field_banner_alert: [
          {
            ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0],
            field_situation_updates: extraSituationUpdates,
          },
        ],
      },
      menu: mockMenu,
      facilities: [facilityMock],
    })
    expect(formattedData.situationUpdates[0].updates[0].dateTime).toBe(
      '2025-09-20T21:41:00+00:00'
    )
    expect(formattedData.situationUpdates[0].updates[1].dateTime).toBe(
      '2025-09-19T21:41:00+00:00'
    )
    expect(formattedData.situationUpdates[0].updates[2].dateTime).toBe(
      '2025-09-18T21:41:00+00:00'
    )
  })
  test('generates a situation update if there is only info', () => {
    const formattedData = formatter({
      entity: {
        ...VamcOperatingStatusAndAlertsMock,
        field_banner_alert: [
          {
            ...VamcOperatingStatusAndAlertsMock.field_banner_alert[0],
            field_situation_updates: null,
            field_banner_alert_situationinfo: '<p>update</p>',
          },
        ],
      },
      menu: mockMenu,
      facilities: [facilityMock],
    })
    expect(formattedData.situationUpdates).toHaveLength(1)
  })
})
