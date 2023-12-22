import { NodeNewsStory } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/newsStory.mock.json'

const nodeNewsStoryMock: NodeNewsStory = mockData

describe('node--news_story formatData', () => {
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
      queries.formatData('node--news_story', nodeNewsStoryMock)
    ).toMatchSnapshot()
  })
})
