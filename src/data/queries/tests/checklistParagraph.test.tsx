import { ChecklistParagraph } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklistParagraph.mock.json'

const ChecklistParagraphMock: ChecklistParagraph = mockData

describe('ChecklistParagraph formatData', () => {
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
      queries.formatData('node--checklist_paragraph', ChecklistParagraphMock)
    ).toMatchSnapshot()
  })
})
