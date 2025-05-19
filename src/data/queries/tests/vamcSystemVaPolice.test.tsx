import { NodeVamcSystemVaPolice } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/healthCareLocalFacility.mock.json'

const VamcSystemVaPoliceMock : NodeVamcSystemVaPolice = mockData

describe('VamcSystemVaPolice formatData', () => {
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
        'node--vamc_system_va_police',
        VamcSystemVaPoliceMock
      )
    ).toMatchSnapshot()
  })
})