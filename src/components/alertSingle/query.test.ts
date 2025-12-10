/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { alertReusable, alertNonReusable } from './mock'
import { params } from './query'

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
  test('formats reusable alert', () => {
    const formattedData = queries.formatData(
      'paragraph--alert_single',
      alertReusable
    )
    expect(formattedData).toMatchSnapshot()
  })

  test('formats non-reusable alert', () => {
    const formattedData = queries.formatData(
      'paragraph--alert_single',
      alertNonReusable
    )
    expect(formattedData).toMatchSnapshot()
  })
})
