import { ParagraphCollapsiblePanelItem } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/collapsiblePanelItem.mock'

const CollapsiblePanelItem: ParagraphCollapsiblePanelItem = mockResponse

describe('Collapsible Panel Item formatData', () => {
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
      queries.formatData(
        'paragraph--collapsible_panel_item',
        CollapsiblePanelItem
      )
    ).toMatchSnapshot()
  })
})
