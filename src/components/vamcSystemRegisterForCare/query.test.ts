import { formatter } from './query'
import mockData from './mock.json'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'

describe('VamcSystemRegisterForCare formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({
      entity: mockData,
      menu: mockMenu as unknown as Menu,
    })

    expect(result.title).toBe('Register for care')
    expect(result.entityId).toBe(44606)
    expect(result.entityPath).toBe('/richmond-health-care/register-for-care')
    expect(result.vamcSystem.title).toBe('VA Richmond health care')
    expect(result.menu).toBeDefined()
    expect(result.menu.rootPath).toBe(
      '/richmond-health-care/register-for-care/'
    )
  })

  // it('formats centralized content fields', () => {
  //   const result = formatter({ entity: mockData })

  //   expect(result.topOfPageContent).toBeDefined()
  //   expect(result.bottomOfPageContent).toBeDefined()
  //   expect(result.relatedLinks).toBeDefined()
  // })
})
