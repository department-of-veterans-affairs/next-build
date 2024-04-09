/**
 * @jest-environment node
 */

import { ParagraphReactWidget } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/reactWidget.mock'

const ReactWidgetMock: ParagraphReactWidget = mockResponse

describe('React widget formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--react_widget', ReactWidgetMock)
    ).toMatchSnapshot()
  })

  test('handles null defaultLink correctly', () => {
    const modifiedMock = { ...ReactWidgetMock, field_default_link: null }
    const formattedData = queries.formatData(
      'paragraph--react_widget',
      modifiedMock
    )
    expect(formattedData.defaultLink).toBeNull()
  })
})
