import { MegaMenuSection } from '@/types/index'
import { formatHeaderData } from './header'

describe('header megamenu', () => {
  test('should format the drupal menu tree into shape FE widget expects', () => {
    const headerMegaMenu = { items: [], tree: [] }
    const promoBlocks = []

    const result = formatHeaderData(
      headerMegaMenu,
      'https://va.gov',
      promoBlocks
    )

    expect(result).toBeInstanceOf(Array<MegaMenuSection>)
  })
})
