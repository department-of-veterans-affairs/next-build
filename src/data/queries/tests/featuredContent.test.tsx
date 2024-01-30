import { ParagraphFeaturedContent } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/featuredContent.mock.json'

const FeaturedContentMock: ParagraphFeaturedContent = mockData

describe('FeaturedContent formatData', () => {
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
      queries.formatData('paragraph--featured_content', FeaturedContentMock)
    ).toMatchSnapshot()
  })
})
