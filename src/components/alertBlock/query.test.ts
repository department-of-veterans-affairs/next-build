import { formatter } from './query'
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
    status: true,
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

  test('returns null for null entity', () => {
    const result = formatter(null)
    expect(result).toBeNull()
  })

  test('returns null for unpublished entity', () => {
    const entity: BlockAlert = { ...baseEntity, status: false }
    const result = formatter(entity)
    expect(result).toBeNull()
  })

  test('returns null for (archived) entity with no status', () => {
    const entity = {
      type: 'block_content--alert',
      id: 'e60159c1-e1db-44c5-aed8-e7d2e98ef0f4',
      resourceIdObjMeta: { drupal_internal__target_id: 124 },
    } as unknown as BlockAlert

    const result = formatter(entity)
    expect(result).toBeNull()
  })

  test('handles other alert types', () => {
    const entity: BlockAlert = { ...baseEntity, field_alert_type: 'warning' }
    const result = formatter(entity)
    expect(result.alertType).toBe('warning')
  })
})
