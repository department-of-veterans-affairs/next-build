import { NodeHealthCareLocalFacility } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/healthCareLocalFacility.mock.json'

const HealthCareLocalFacilityMock: NodeHealthCareLocalFacility = mockData

describe('HealthCareLocalFacility formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(
      queries.formatData('node--health_care_local_facility', {
        entity: HealthCareLocalFacilityMock,
        menu: {
          items: [],
          tree: [],
        },
      })
    ).toMatchSnapshot()
  })
})
