import { DrupalMediaImage } from '@/types/drupal/media'
import { queries } from '@/data/queries/'
import mockData from '@/mocks/mediaImage.mock.json'

//eslint-disable-next-line
const mediaImageMock: DrupalMediaImage | any = mockData

describe('Media image returns formatted data', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)
    const formattedData = mediaImageMock
    expect(queries.formatData('media--image', formattedData)).toMatchSnapshot()
  })
})
