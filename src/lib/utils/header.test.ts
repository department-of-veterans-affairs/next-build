import { MegaMenuSection } from '@/types/dataTypes/formatted/headerFooter'
import { formatHeaderData } from './header'

describe('header megamenu', () => {
  test('should format the drupal menu tree into shape FE widget expects', () => {
    const headerMegaMenu = { items: [], tree: [] }

    const result = formatHeaderData(headerMegaMenu, 'https://va.gov')

    expect(result).toBeInstanceOf(Array<MegaMenuSection>)
  })
})
