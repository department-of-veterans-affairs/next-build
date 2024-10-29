/**
 * @jest-environment node
 */

import { queries } from '@/data/queries'
import mockData from '@/mocks/checklistItem.mock.json'
import { ParagraphChecklistItem } from '@/types/drupal/paragraph'

const ChecklistItemMock: ParagraphChecklistItem = mockData

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
      field_section_intro: '',
      type: 'paragraph--checklist_item',
      id: 'c4d10aa1-3bb9-4f39-99fd-f110b465603f',
      'drupal_internal__id': 13919,
      'drupal_internal__revision_id': 149239,
      langcode: 'en',
      status: true
    }

    const formattedDataEmpty = queries.formatData('paragraph--checklist_item', emptyData)

    expect(formattedDataEmpty).toEqual({
      items: [],
      header: '',
      intro: '',
      type: 'paragraph--checklist_item',
      id: 'c4d10aa1-3bb9-4f39-99fd-f110b465603f'
    })
  })
})
