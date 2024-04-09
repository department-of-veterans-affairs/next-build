/**
 * @jest-environment node
 */

import { ParagraphNonReusableAlert } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/alertNonReusable.mock'

const AlertNonResuableMock: ParagraphNonReusableAlert = mockResponse

describe('alert non reusable formatData', () => {
  test('outputs formatted data', () => {
    const formattedData = queries.formatData(
      'paragraph--non_reusable_alert',
      AlertNonResuableMock
    )
    expect(formattedData).toMatchSnapshot()
  })
  test('returns null when entity is null', () => {
    const formattedData = queries.formatData(
      'paragraph--non_reusable_alert',
      null
    )
    expect(formattedData).toBeNull()
  })
  test('correctly formats alertType as info when field_alert_type is information', () => {
    const mockWithInformationType = {
      ...AlertNonResuableMock,
      field_alert_type: 'information',
    }
    const formattedData = queries.formatData(
      'paragraph--non_reusable_alert',
      mockWithInformationType
    )
    expect(formattedData.alertType).toBe('info')
  })
  test('preserves field_alert_type when it is not information', () => {
    const mockWithWarningType = {
      ...AlertNonResuableMock,
      field_alert_type: 'warning',
    }
    const formattedData = queries.formatData(
      'paragraph--non_reusable_alert',
      mockWithWarningType
    )
    expect(formattedData.alertType).toBe('warning')
  })
})
