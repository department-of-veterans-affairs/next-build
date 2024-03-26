import { NodeVetCenter } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/vetCenter.mock'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const VetCenterMock: NodeVetCenter = mockResponse

describe(`${RESOURCE_TYPES.VET_CENTER} formatData`, () => {
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
      queries.formatData(RESOURCE_TYPES.VET_CENTER, VetCenterMock)
    ).toMatchSnapshot()
  })
})
