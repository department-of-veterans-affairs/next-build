/**
 * @jest-environment node
 */

import { ChecklistItem } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklistItem.mock.json'

const ChecklistItemMock: ChecklistItem = mockData

describe('ChecklistItem formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--checklist_item', ChecklistItemMock)
    ).toMatchSnapshot()
  })

  test('handles no answers correctly', () => {
    const emptyData = {
      field_checklist_items: [],
      field_section_header: '',
      field_section_intro: ''
    }

    const formattedDataEmpty = queries.formatData('paragraph--checklist_item', emptyData)

    expect(formattedDataEmpty).toEqual({
      items: [],
      header: '',
      intro: ''
    })
  })
})
