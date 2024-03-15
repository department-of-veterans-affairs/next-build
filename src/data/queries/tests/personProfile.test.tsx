import { NodePersonProfile } from '@/types/drupal/node'
import { queries } from '@/data/queries/'
import mockData from '@/mocks/personProfile.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

//eslint-disable-next-line
const personProfileMock: NodePersonProfile | any = mockData

describe('Person profile returns formatted data', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const formattedData = personProfileMock
    expect(
      queries.formatData(RESOURCE_TYPES.PERSON_PROFILE, formattedData)
    ).toMatchSnapshot()
  })
})
