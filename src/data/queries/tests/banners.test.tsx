import { NodeBanner } from '@/types/drupal/node'
import { queries } from '@/data/queries/'
import mockData from '@/mocks/banners.mock.json'

//eslint-disable-next-line
const nodeBannerMock: NodeBanner | any = mockData

describe('Banners return formatted data', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const formattedData = nodeBannerMock
    expect(
      queries.formatData('banner--alerts_lookup', formattedData)
    ).toMatchSnapshot()
  })
})
