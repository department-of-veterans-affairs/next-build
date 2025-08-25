/**
 * @jest-environment node
 */

import { ParagraphCollapsiblePanelItem } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/collapsiblePanelItem.mock'

const CollapsiblePanelItem: ParagraphCollapsiblePanelItem = mockResponse

describe('Collapsible Panel Item formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData(
        'paragraph--collapsible_panel_item',
        CollapsiblePanelItem
      )
    ).toMatchSnapshot()
  })
  test('handles null wysiwyg gracefully', () => {
    const panelItemWithNullWysiwyg: ParagraphCollapsiblePanelItem = {
      ...CollapsiblePanelItem,
      field_wysiwyg: undefined,
    }

    const formattedData = queries.formatData(
      'paragraph--collapsible_panel_item',
      panelItemWithNullWysiwyg
    )
    expect(formattedData.wysiwyg).toBeNull()
  })
})
