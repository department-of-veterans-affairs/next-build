/**
 * @jest-environment node
 */

import { CampaignLandingPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const CampaignLandingPageMock: CampaignLandingPage = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('CampaignLandingPage formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--campaign_landing_page', CampaignLandingPageMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
