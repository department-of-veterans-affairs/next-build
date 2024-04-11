import { formatter } from '../alertBlock'
import { BlockAlert } from '@/types/drupal/block'

describe('alertBlock formatter', () => {
  const baseEntity: BlockAlert = {
    field_alert_type: 'information',
    id: '1',
    field_alert_title: 'Test Alert',
    //@ts-expect-error for testing
    field_alert_content: {},
    field_reusability: '',
    info: '',
    type: '',
    langcode: '',
    status: false,
  }

  test('correctly formats valid entity', () => {
    const entity = { ...baseEntity }
    const result = formatter(entity)
    expect(result).toEqual({
      alertType: 'info',
      id: '1',
      title: 'Test Alert',
      content: null,
    })
  })

  test('correctly formats null entity', () => {
    const result = formatter(null)
    expect(result).toBeNull()
  })

  test('correctly formats alertType as "warning" when field_alert_type is "warning"', () => {
    const entity: BlockAlert = { ...baseEntity, field_alert_type: 'warning' }
    const result = formatter(entity)
    expect(result.alertType).toBe('warning')
  })
})
