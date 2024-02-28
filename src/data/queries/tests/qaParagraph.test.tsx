import { ParagraphQaParagraph } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaParagraph.mock.json'

const QaParagraphMock: ParagraphQaParagraph = mockData

describe('QaParagraph formatData', () => {
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
      queries.formatData('paragraph--q_a', QaParagraphMock)
    ).toMatchSnapshot()
  })
})
