/**
 * @jest-environment node
 */

import { ParagraphCollapsiblePanel } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/collapsiblePanel.mock'
import { params } from '../collapsiblePanel'
const CollapsiblePanel: ParagraphCollapsiblePanel = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(/include=field_va_paragraphs/)
  })
})

describe('Collapsible Panel formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--collapsible_panel', CollapsiblePanel)
    ).toMatchSnapshot()
  })
})
