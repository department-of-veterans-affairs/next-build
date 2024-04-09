import { formatter } from '../supportServices'
import mockData from '@/mocks/supportServices.mock.json'
import { NodeSupportService } from '@/types/drupal/node'

describe('SupportServices formatter function', () => {
  test('formats active support service correctly', () => {
    const activeServiceMock =
      mockData[0] as unknown as Partial<NodeSupportService>

    const formatted = formatter(
      activeServiceMock as unknown as NodeSupportService
    )
    expect(formatted).toEqual({
      title: activeServiceMock.title,
      value: activeServiceMock.field_phone_number,
      href: activeServiceMock.field_link.uri,
    })
  })

  test('returns null for inactive support service', () => {
    const inactiveServiceMock = {
      ...mockData[0],
      status: false,
    } as unknown as Partial<NodeSupportService>
    const formatted = formatter(
      inactiveServiceMock as unknown as NodeSupportService
    )
    expect(formatted).toBeNull()
  })

  test('returns null for null entity', () => {
    const formatted = formatter(null as unknown as NodeSupportService)
    expect(formatted).toBeNull()
  })
})
