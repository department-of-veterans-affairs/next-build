import { FieldHealthServicesArray } from '@/types/drupal/field_type'
import { queries } from '@/data/queries'
import mockResponse from '@/mocks/healthServices.mock.json'

const HealthServicesMock: FieldHealthServicesArray = mockResponse

describe('healthServices formatData', () => {
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
      queries.formatData(
        'node--vet_center_facility_health_servi',
        HealthServicesMock
      )
    ).toMatchSnapshot()
  })
})
