/**
 * @jest-environment node
 */

import { ParagraphAlertSingle } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alertSingle.mock'
import { params } from '../alertSingle'

const AlertSingle: ParagraphAlertSingle = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_alert_block_reference,field_alert_block_reference.field_alert_content,field_alert_non_reusable_ref,field_alert_non_reusable_ref.field_va_paragraphs/
    )
  })
})

describe('alert single formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      'paragraph--alert_single',
      AlertSingle
    )
    expect(formattedData).toMatchSnapshot()
  })
})
