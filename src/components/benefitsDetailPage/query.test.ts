/**
 * @jest-environment node
 */

import { BenefitsDetailPage } from '@/types/drupal/node'
import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

const BenefitsDetailPageMock: BenefitsDetailPage = mockData

// remove if this component does not have a data fetch
describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    // TODO
  })
})

describe('BenefitsDetailPage formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--benefits_detail_page', BenefitsDetailPageMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    // TODO
  })
})
