/**
 * @jest-environment node
 */

import { NodeCampaignLandingPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const campaignLandingPageMock = mockData as unknown as NodeCampaignLandingPage

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('CampaignLandingPage formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--campaign_landing_page', campaignLandingPageMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
