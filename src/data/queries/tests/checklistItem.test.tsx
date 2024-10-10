import { ChecklistItem } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklistItem.mock.json'

const ChecklistItemMock: ChecklistItem = mockData

describe('ChecklistItem formatData', () => {
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
      queries.formatData('node--checklist_item', ChecklistItemMock)
    ).toMatchSnapshot()
  })
})
