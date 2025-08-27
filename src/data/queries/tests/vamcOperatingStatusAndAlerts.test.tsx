/**
 * @jest-environment node
 */

import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcOperatingStatusAndAlerts.mock.json'
import { params } from '../vamcOperatingStatusAndAlerts'

const VamcOperatingStatusAndAlertsMock: NodeVamcOperatingStatusAndAlerts =
  mockData

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
      })
    ).toMatchSnapshot()
  })
})
