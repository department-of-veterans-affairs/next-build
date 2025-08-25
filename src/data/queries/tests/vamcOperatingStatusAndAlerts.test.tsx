/**
 * @jest-environment node
 */

import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/vamcOperatingStatusAndAlerts.mock.json'

const VamcOperatingStatusAndAlertsMock: NodeVamcOperatingStatusAndAlerts =
  mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('VamcOperatingStatusAndAlerts formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'node--vamc_operating_status_and_alerts',
        VamcOperatingStatusAndAlertsMock
      )
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
