import { NodeVetCenter } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/VetCenter.mock.json'

const VetCenterMock: NodeVetCenter = mockData

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
