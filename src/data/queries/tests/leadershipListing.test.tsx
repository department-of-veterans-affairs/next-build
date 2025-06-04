/**
 * @jest-environment node
 */
import { NodeLeadershipListing } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/leadershipListing.mock.json'
import { params } from '../leadershipListing'

//eslint-disable-next-line
const leadershipListingMock: NodeLeadershipListing | any = mockData

describe('DrupalJsonApiParams configuration', () => {
  test('params function includes the correct fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_leadership,field_office,field_leadership.field_media.image,field_leadership.field_telephone,field_leadership.field_office,field_administration/
    )
  })
})

describe('LeadershipListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--leadership_listing', {
        entity: leadershipListingMock,
        menu: null,
      })
    ).toMatchSnapshot()
  })
})
