import { ParagraphCollapsiblePanel } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/collapsiblePanel.mock'

const CollapsiblePanel: ParagraphCollapsiblePanel = mockResponse

describe('Collapsible Panel formatData', () => {
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
      queries.formatData('paragraph--collapsible_panel', CollapsiblePanel)
    ).toMatchSnapshot()
  })
})
