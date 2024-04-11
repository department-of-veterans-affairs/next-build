/**
 * @jest-environment node
 */

import { NodePersonProfile } from '@/types/drupal/node'
import { queries } from '@/data/queries/'
import mockData from '@/mocks/personProfile.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

//eslint-disable-next-line
const personProfileMock: NodePersonProfile | any = mockData

describe('Person profile returns formatted data', () => {
  test('outputs formatted data', () => {
    const formattedData = personProfileMock
    expect(
      queries.formatData(RESOURCE_TYPES.PERSON_PROFILE, formattedData)
    ).toMatchSnapshot()
  })
  test('returns null when entity is null', () => {
    const formattedData = queries.formatData(
      RESOURCE_TYPES.PERSON_PROFILE,
      null
    )

    expect(formattedData).toBeNull()
  })
})

test('handles null and optional fields correctly', () => {
  const modifiedMock = {
    ...personProfileMock,
    field_phone_number: null,
    field_media: undefined,
  }

  const formattedData = queries.formatData(
    RESOURCE_TYPES.PERSON_PROFILE,
    modifiedMock
  )

  expect(formattedData.phoneNumber).toBeNull()
  expect(formattedData.media).toBeNull()
})
