import { NodeVetCenter } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/vetCenter.mock'

const VetCenterMock: NodeVetCenter = mockResponse

describe('VetCenter formatData', () => {
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
      queries.formatData('node--vet_center', VetCenterMock)
    ).toMatchSnapshot()
  })
})
