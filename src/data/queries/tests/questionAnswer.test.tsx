import { queries } from '@/data/queries'
import { NodeQA } from '@/types/drupal/node'
import mockData from '@/mocks/questionAnswer.mock.json'

// Adding this because next-drupal has some bad type definitions.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/* @ts-ignore */
const questionAnswerMocks: NodeQA[] = mockData

describe('node--q_a formatData', () => {
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
      questionAnswerMocks.map((mock) => {
        return queries.formatData('node--q_a', mock)
      })
    ).toMatchSnapshot()
  })
})
