import { ParagraphQaSection } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaSection.mock.json'

const QaSectionMock: ParagraphQaSection = mockData

describe('QaSection formatData', () => {
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
      queries.formatData('paragraph--q_a_section', QaSectionMock)
    ).toMatchSnapshot()
  })
})
