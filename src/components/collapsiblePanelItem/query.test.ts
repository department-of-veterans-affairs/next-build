/**
 * @jest-environment node
 */

import { ParagraphCollapsiblePanelItem } from '@/types/drupal/paragraph'
import { queries } from '@/lib/drupal/queries'
import { mockResponse } from '@/components/collapsiblePanelItem/mock'

const CollapsiblePanelItem = mockResponse as ParagraphCollapsiblePanelItem

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
    const panelItemWithNullWysiwyg = {
      ...CollapsiblePanelItem,
      field_wysiwyg: undefined,
    } as ParagraphCollapsiblePanelItem

    const formattedData = queries.formatData(
      'paragraph--collapsible_panel_item',
      panelItemWithNullWysiwyg
    )
    expect(formattedData.wysiwyg).toBeNull()
  })
})
