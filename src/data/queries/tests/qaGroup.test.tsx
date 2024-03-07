import { ParagraphQaGroup } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/qaGroup.mock.json'

const QaGroupMock: ParagraphQaGroup = mockData

describe('QaGroup formatData', () => {
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
      queries.formatData('paragraph--q_a_group', QaGroupMock)
    ).toMatchSnapshot()
  })
})
