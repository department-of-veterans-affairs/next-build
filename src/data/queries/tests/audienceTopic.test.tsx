import { queries } from '@/data/queries'
import { ParagraphAudienceTopics } from '@/types/drupal/paragraph'
import mockData from '@/mocks/audienceTopics.mock.json'

// Adding this because next-drupal has some bad type definitions.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const audienceTopicsMocks: ParagraphAudienceTopics[] = mockData

describe('paragraph--audience_topics formatData', () => {
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
      audienceTopicsMocks.map((mock) => {
        return queries.formatData('paragraph--audience_topics', mock)
      })
    ).toMatchSnapshot()
  })
})
