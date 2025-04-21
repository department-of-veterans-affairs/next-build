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
      queries.formatData(RESOURCE_TYPES.STAFF_PROFILE, {
        entity: formattedData,
      })
    ).toMatchSnapshot()
  })
})
