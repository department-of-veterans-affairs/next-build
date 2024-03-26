import { NodeNewsStory } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/newsStory.mock.json'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const nodeNewsStoryMock: NodeNewsStory = mockData

describe(`${RESOURCE_TYPES.STORY} formatData`, () => {
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
      queries.formatData(RESOURCE_TYPES.STORY, nodeNewsStoryMock)
    ).toMatchSnapshot()
  })
})
