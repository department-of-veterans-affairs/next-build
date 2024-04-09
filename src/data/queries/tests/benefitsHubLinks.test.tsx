/**
 * @jest-environment node
 */

import { NodeLandingPage } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/benefitHubs.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { params } from '../benefitsHubLinks'

// field_related_office is causing issues here, I believe because the referenced node is unpublished (node/38439)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const nodeBenefitsHubMock: NodeLandingPage[] = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_support_services/)
  })
})

describe(`${RESOURCE_TYPES.BENEFITS_HUB} formatData`, () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      RESOURCE_TYPES.BENEFITS_HUB,
      nodeBenefitsHubMock
    )
    expect(formattedData).toMatchSnapshot()
  })
})
