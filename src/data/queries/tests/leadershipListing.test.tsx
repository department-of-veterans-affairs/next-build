/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/leadershipListing.mock.json'
import { LeadershipListingData } from '@/data/queries/leadershipListing'

const LeadershipListingMock: LeadershipListingData = mockData

describe('LeadershipListing formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('node--leadership_listing', LeadershipListingMock)
    ).toMatchSnapshot()
  })

  test('handles absence of optional fields gracefully', () => {
    const modifiedMock = {
      ...LeadershipListingMock,
      field_intro_text: null,
    }

    const formattedData = queries.formatData('node--leadership_listing', modifiedMock)

    expect(formattedData.introText).toBeNull()
  })
})
