import { formatter } from './query'
import mockPage from './mock.json'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'
import { NodeVamcSystemDetailPage } from '@/types/drupal/node'

describe('VamcSystemDetailPage formatter', () => {
  it('formats basic fields correctly', () => {
    const result = formatter({entity: mockPage as NodeVamcSystemDetailPage, menu: mockMenu as unknown as Menu, lovell: null})

    expect(result.title).toBe('Research')
    expect(result.introText).toBe(
      'Explore VA Bronx\'s research initiatives with specialty programs in [List research here] . You can also volunteer to participate in a research study.'
    )
    expect(result.entityId).toBe(19534)
    expect(result.entityPath).toBe('/bronx-health-care/research')
  })
})
